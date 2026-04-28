import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "Teacher";
  const nav = useNavigate();

  useEffect(() => {
    // Only teachers can access upload
    if (!role) { nav("/"); return; }
    if (role !== "teacher") { nav("/dashboard"); return; }
  }, [nav, role]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setMsg("Please select a file"); return; }
    if (!title.trim()) { setMsg("Please enter a title"); return; }

    setUploading(true);
    setMsg("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("subject", subject || "General");
    formData.append("uploadedBy", name);

    try {
      const res = await fetch("/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setMsg("✅ " + data.msg);
        setFile(null); setTitle(""); setSubject("");
        // Reset file input
        const fileInput = document.getElementById("file-input");
        if (fileInput) fileInput.value = "";
      } else {
        setMsg("❌ " + (data.msg || "Upload failed"));
      }
    } catch {
      setMsg("❌ Cannot connect to server");
    }
    setUploading(false);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <h1>📤 <span>Upload Notes</span></h1>
        </div>

        <div className="card" style={{ maxWidth: 600 }}>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="input" placeholder="e.g. Chapter 3 - Thermodynamics"
                value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <select className="input select" value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Computer Science">Computer Science</option>
                <option value="English">English</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">File</label>
              <div className="upload-zone" onClick={() => document.getElementById("file-input").click()}>
                <input type="file" id="file-input" style={{ display: "none" }}
                  onChange={e => setFile(e.target.files[0])} />
                <div className="upload-icon">📁</div>
                <p>{file ? `Selected: ${file.name}` : "Click to select a file (PDF, DOC, PPT, etc.)"}</p>
              </div>
            </div>

            {msg && (
              <div style={{
                padding: "10px 14px", borderRadius: 10, marginBottom: 16, fontSize: 13,
                background: msg.startsWith("✅") ? "rgba(0,210,160,0.12)" : "rgba(233,69,96,0.12)",
                color: msg.startsWith("✅") ? "var(--accent-success)" : "var(--accent-secondary)"
              }}>
                {msg}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={uploading}
              style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
              {uploading ? "Uploading..." : "📤 Upload Notes"}
            </button>
          </form>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}
