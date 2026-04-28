import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const role = localStorage.getItem("role");
  const nav = useNavigate();

  useEffect(() => {
    if (!role) { nav("/"); return; }
    fetch("/notes").then(r => r.json()).then(setNotes).catch(() => {});
  }, [nav, role]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    await fetch(`/notes/${id}`, { method: "DELETE" });
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <h1>📚 <span>Notes</span></h1>
          {role === "teacher" && (
            <button className="btn btn-primary" onClick={() => nav("/upload")}>📤 Upload New</button>
          )}
        </div>

        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No notes available</h3>
            <p>Notes uploaded by teachers will appear here.</p>
          </div>
        ) : (
          <div className="card-grid">
            {notes.map((note, i) => (
              <div className={`card fade-in fade-in-delay-${(i % 4) + 1}`} key={note.id}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{note.title}</h3>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <span className="badge badge-info">{note.subject}</span>
                  <span className="badge badge-success">{note.date}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
                  By {note.uploadedBy}
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  {note.filename && (
                    <a href={`/download/${note.filename}`}
                      className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
                      ⬇ Download
                    </a>
                  )}
                  {role === "teacher" && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(note.id)}>
                      🗑 Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
}
