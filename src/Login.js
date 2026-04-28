import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill all fields"); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        nav("/dashboard");
      } else {
        setError(data.msg || "Invalid credentials");
      }
    } catch {
      setError("Cannot connect to server");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 48 }}>📘</span>
        </div>
        <h1>EduNotes Portal</h1>
        <p className="subtitle">Sign in to access your dashboard</p>

        {error && (
          <div style={{
            background: "rgba(233,69,96,0.12)", border: "1px solid rgba(233,69,96,0.3)",
            color: "#e94560", padding: "10px 14px", borderRadius: 10, marginBottom: 16, fontSize: 13
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={login}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input" type="email" placeholder="Enter your email"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="input" type="password" placeholder="Enter your password"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: 8, padding: "14px" }}>
            {loading ? "Signing in..." : "🔐 Sign In"}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: "14px", background: "rgba(108,99,255,0.08)",
          borderRadius: 10, fontSize: 12, color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>Demo Credentials:</strong><br />
          👩‍🏫 Teacher: teacher@gmail.com / 123<br />
          👨‍🎓 Student: student@gmail.com / 123
        </div>
      </div>
    </div>
  );
}
