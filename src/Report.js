import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";

export default function Report() {
  const [report, setReport] = useState([]);
  const role = localStorage.getItem("role");
  const nav = useNavigate();

  useEffect(() => {
    if (!role) { nav("/"); return; }
    fetch("/report").then(r => r.json()).then(setReport).catch(() => {});
  }, [nav, role]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar"><h1>📄 <span>Report</span></h1></div>

        <div className="card-grid" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(108,99,255,0.15)" }}>👥</div>
            <div className="stat-value">{report.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(0,210,160,0.15)" }}>✅</div>
            <div className="stat-value">
              {report.length > 0 ? Math.round(report.reduce((s, r) => s + r.percentage, 0) / report.length) : 0}%
            </div>
            <div className="stat-label">Avg Attendance</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(233,69,96,0.15)" }}>⚠️</div>
            <div className="stat-value">{report.filter(r => r.percentage < 75).length}</div>
            <div className="stat-label">Below 75%</div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr><th>Roll No</th><th>Name</th><th>Total</th><th>Present</th><th>Absent</th><th>Percentage</th></tr>
            </thead>
            <tbody>
              {report.map(r => (
                <tr key={r.id}>
                  <td>{r.rollNo}</td>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td>{r.totalClasses}</td>
                  <td><span className="badge badge-success">{r.present}</span></td>
                  <td><span className="badge badge-danger">{r.absent}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 80, height: 6, borderRadius: 3,
                        background: "rgba(108,99,255,0.15)", overflow: "hidden"
                      }}>
                        <div style={{
                          width: `${r.percentage}%`, height: "100%", borderRadius: 3,
                          background: r.percentage >= 75 ? "var(--accent-success)" : "var(--accent-secondary)"
                        }} />
                      </div>
                      <span style={{
                        fontWeight: 700, fontSize: 13,
                        color: r.percentage >= 75 ? "var(--accent-success)" : "var(--accent-secondary)"
                      }}>{r.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}
