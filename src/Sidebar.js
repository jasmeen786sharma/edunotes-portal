import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { path: "/dashboard", icon: "📊", label: "Dashboard" },
  { path: "/notes", icon: "📚", label: "Notes" },
  { path: "/upload", icon: "📤", label: "Upload", teacherOnly: true },
  { path: "/attendance", icon: "📋", label: "Attendance" },
  { path: "/progress", icon: "📈", label: "Progress" },
  { path: "/report", icon: "📄", label: "Report" }
];

export default function Sidebar() {
  const nav = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "User";
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    nav("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">📘</div>
        <h2>EduNotes</h2>
      </div>

      <div className="sidebar-nav">
        {navItems
          .filter(item => !item.teacherOnly || role === "teacher")
          .map(item => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => nav(item.path)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{name}</div>
            <div className="user-role">{role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}