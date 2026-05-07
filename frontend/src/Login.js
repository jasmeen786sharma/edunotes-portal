import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Signup
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [phone, setPhone] = useState("");
  
  // Forgot Password
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
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
        if (data.subject) localStorage.setItem("subject", data.subject);
        nav("/dashboard");
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError("Server error. Make sure backend is running.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, phone })
      });
      const data = await res.json();
      if (res.ok) {
        setMode("login");
        setError("Signup successful! Please login.");
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError("Server error.");
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setError("OTP sent to your phone (Check backend console for OTP 1234).");
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError("Server error.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMode("login");
        setOtpSent(false);
        setError("Password reset successful! Please login.");
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError("Server error.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>📘</div>
          <h1>EduNotes</h1>
          <p className="subtitle">Premium Learning Portal</p>
        </div>

        {error && <div style={{ color: error.includes("successful") ? "#30D158" : "#FF453A", background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", fontSize: "14px" }}>{error}</div>}

        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@gmail.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px", padding: "16px" }}>Login</button>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", fontSize: "14px" }}>
              <span style={{ color: "var(--accent-primary)", cursor: "pointer" }} onClick={() => { setMode("forgot"); setError(""); }}>Forgot Password?</span>
              <span style={{ color: "var(--text-secondary)", cursor: "pointer" }} onClick={() => { setMode("signup"); setError(""); }}>Create Account</span>
            </div>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" required className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@gmail.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" required className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px", padding: "16px" }}>Sign Up</button>
            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
              <span style={{ color: "var(--text-secondary)", cursor: "pointer" }} onClick={() => { setMode("login"); setError(""); }}>Already have an account? Login</span>
            </div>
          </form>
        )}

        {mode === "forgot" && !otpSent && (
          <form onSubmit={handleSendOTP}>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "14px", textAlign: "center" }}>Enter your registered phone number to receive an OTP.</p>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" required className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px", padding: "16px" }}>Send OTP</button>
            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
              <span style={{ color: "var(--text-secondary)", cursor: "pointer" }} onClick={() => { setMode("login"); setError(""); }}>Back to Login</span>
            </div>
          </form>
        )}

        {mode === "forgot" && otpSent && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">Enter OTP</label>
              <input type="text" required className="input" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="1234" />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" required className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px", padding: "16px" }}>Reset Password</button>
            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
              <span style={{ color: "var(--text-secondary)", cursor: "pointer" }} onClick={() => { setMode("login"); setOtpSent(false); setError(""); }}>Back to Login</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
