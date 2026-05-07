import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const ToastNotifier = () => {
  const [toasts, setToasts] = useState([]);
  const prevCountRef = useRef(0);
  const nav = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Only teachers get notified when new questions are asked,
    // or students get notified when a teacher answers.
    // For simplicity, we'll notify everyone when there's a new question.
    let interval;
    if (role) {
      interval = setInterval(async () => {
        try {
          const res = await fetch("/questions");
          if (res.ok) {
            const data = await res.json();
            const currentCount = data.length;
            
            if (prevCountRef.current !== 0 && currentCount > prevCountRef.current) {
              const newQuestion = data[0]; // assuming new questions are unshifted
              addToast(`New question from ${newQuestion.studentName}: "${newQuestion.question}"`);
            }
            prevCountRef.current = currentCount;
          }
        } catch (err) {}
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [role]);

  const addToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (e, id) => {
    e.stopPropagation();
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className="toast-message"
          onClick={() => nav("/qna")}
        >
          <div style={{fontSize: "24px"}}>🔔</div>
          <div style={{flex: 1}}>
            <strong style={{display: "block", marginBottom: "4px"}}>New Activity in Q&A</strong>
            <span style={{fontSize: "14px", color: "var(--text-secondary)"}}>{toast.message}</span>
          </div>
          <button className="toast-close" onClick={(e) => removeToast(e, toast.id)}>×</button>
        </div>
      ))}
    </div>
  );
};

export default ToastNotifier;
