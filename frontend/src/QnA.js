import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";
import "./index.css";

const QnA = () => {
  const nav = useNavigate();
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("name") || "User";

  const [questions, setQuestions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [targetTeacher, setTargetTeacher] = useState("");
  const [answerInputs, setAnswerInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!role) {
      nav("/");
      return;
    }
    fetchQuestions();
    if (role === "student") {
      fetchTeachers();
    }
  }, [nav, role]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/questions?role=${role}&name=${encodeURIComponent(userName)}`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/teachers");
      if (res.ok) {
        const data = await res.json();
        setTeachers(data);
        if (data.length > 0) setTargetTeacher(data[0].name);
      }
    } catch (err) {}
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    if (!targetTeacher) {
      alert("Please select a teacher to ask.");
      return;
    }
    try {
      const res = await fetch("/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName: userName, question: newQuestion, targetTeacher })
      });
      if (res.ok) {
        setNewQuestion("");
        fetchQuestions();
      } else {
        const data = await res.json();
        alert(data.msg);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerChange = (id, text) => {
    setAnswerInputs({ ...answerInputs, [id]: text });
  };

  const handlePostAnswer = async (id) => {
    const text = answerInputs[id];
    if (!text || !text.trim()) return;
    try {
      const res = await fetch(`/questions/${id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherName: userName, answer: text })
      });
      if (res.ok) {
        setAnswerInputs({ ...answerInputs, [id]: "" });
        fetchQuestions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <h1>Q&A Forum 💬</h1>
        </div>

        <div className="page-container fade-in">
          <p style={{marginBottom: "20px", color: "var(--text-secondary)"}}>
            {role === "student" 
              ? "Select a teacher and ask your question directly. Only that teacher will see it."
              : "Here are the questions directed specifically to you from your students."}
          </p>

          {role === "student" && (
            <div className="glass-panel" style={{marginBottom: "30px", padding: "20px"}}>
              <h3 style={{marginBottom: "15px"}}>Ask a Question</h3>
              <form onSubmit={handleAskQuestion} style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <select 
                  className="select" 
                  value={targetTeacher} 
                  onChange={(e) => setTargetTeacher(e.target.value)}
                  style={{padding: "12px", borderRadius: "8px"}}
                >
                  {teachers.map(t => (
                    <option key={t.email} value={t.name}>{t.name}</option>
                  ))}
                </select>
                <div style={{display: "flex", gap: "10px"}}>
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Type your question here..."
                    style={{flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "white"}}
                  />
                  <button type="submit" className="btn btn-primary" style={{padding: "0 20px"}}>Ask</button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <p>Loading questions...</p>
          ) : error ? (
            <p className="error-msg">{error}</p>
          ) : (
            <div className="qna-list" style={{display: "flex", flexDirection: "column", gap: "20px"}}>
              {questions.length === 0 ? (
                <p>No questions found.</p>
              ) : (
                questions.map(q => (
                  <div key={q.id} className="glass-panel qna-item" style={{padding: "20px"}}>
                    <div style={{marginBottom: "15px"}}>
                      <h4 style={{fontSize: "18px", color: "white", marginBottom: "5px"}}>{q.question}</h4>
                      <small style={{color: "var(--text-secondary)"}}>
                        {role === "student" ? `Asked to ${q.targetTeacher}` : `Asked by ${q.studentName}`} on {q.date}
                      </small>
                    </div>

                    <div className="answers-section" style={{marginLeft: "20px", borderLeft: "2px solid rgba(255,255,255,0.1)", paddingLeft: "15px"}}>
                      {q.answers.length > 0 ? (
                        q.answers.map((ans, idx) => (
                          <div key={idx} style={{marginBottom: "10px", padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "8px"}}>
                            <p style={{margin: "0 0 5px 0", fontSize: "15px"}}>{ans.answer}</p>
                            <small style={{color: "var(--primary-color)"}}>Answered by {ans.teacherName} on {ans.date}</small>
                          </div>
                        ))
                      ) : (
                        <p style={{fontStyle: "italic", color: "var(--text-secondary)", fontSize: "14px"}}>No answers yet.</p>
                      )}

                      {role === "teacher" && (
                        <div style={{marginTop: "15px", display: "flex", gap: "10px"}}>
                          <input
                            type="text"
                            value={answerInputs[q.id] || ""}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            placeholder="Type your answer..."
                            style={{flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px"}}
                          />
                          <button onClick={() => handlePostAnswer(q.id)} className="btn btn-secondary" style={{padding: "8px 15px", fontSize: "14px"}}>Reply</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default QnA;
