import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";

export default function Dashboard() {
  const nav = useNavigate();
  const name = localStorage.getItem("name") || "User";
  const role = localStorage.getItem("role");
  const [stats, setStats] = useState({ notes: 0, attendance: 0, students: 0 });

  useEffect(() => {
    if (!role) { nav("/"); return; }
    // Fetch some stats
    Promise.all([
      fetch("/notes").then(r => r.json()),
      fetch("/attendance").then(r => r.json()),
      fetch("/students").then(r => r.json())
    ]).then(([notes, attendance, students]) => {
      setStats({ notes: notes.length, attendance: attendance.length, students: students.length });
    }).catch(() => {});
  }, [nav, role]);

  const teacherCards = [
    { icon: "📚", label: "Total Notes", value: stats.notes, bg: "rgba(108,99,255,0.15)" },
    { icon: "👥", label: "Total Students", value: stats.students, bg: "rgba(0,210,160,0.15)" },
    { icon: "📋", label: "Classes Taken", value: stats.attendance, bg: "rgba(233,69,96,0.15)" },
    { icon: "📊", label: "Avg Attendance", value: "78%", bg: "rgba(255,193,7,0.15)" }
  ];

  const studentCards = [
    { icon: "📚", label: "Available Notes", value: stats.notes, bg: "rgba(108,99,255,0.15)" },
    { icon: "📋", label: "Classes Attended", value: stats.attendance, bg: "rgba(0,210,160,0.15)" },
    { icon: "🎯", label: "Attendance %", value: "83%", bg: "rgba(233,69,96,0.15)" },
    { icon: "📈", label: "Progress", value: "Good", bg: "rgba(255,193,7,0.15)" }
  ];

  const cards = role === "teacher" ? teacherCards : studentCards;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <h1>Welcome back, <span>{name}</span> 👋</h1>
          <span className="badge badge-info" style={{ fontSize: 13, padding: "6px 14px" }}>
            {role === "teacher" ? "👩‍🏫 Teacher" : "👨‍🎓 Student"}
          </span>
        </div>

        <div className="card-grid">
          {cards.map((card, i) => (
            <div className={`stat-card fade-in fade-in-delay-${i + 1}`} key={i}>
              <div className="stat-icon" style={{ background: card.bg }}>{card.icon}</div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Quick Actions</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => nav("/notes")}>📚 View Notes</button>
            <button className="btn btn-secondary" onClick={() => nav("/attendance")}>📋 Attendance</button>
            {role === "teacher" && (
              <button className="btn btn-success" onClick={() => nav("/upload")}>📤 Upload Notes</button>
            )}
            <button className="btn btn-secondary" onClick={() => nav("/report")}>📄 View Report</button>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}
