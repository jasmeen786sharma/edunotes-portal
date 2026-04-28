import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);

  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newSubject, setNewSubject] = useState("Mathematics");
  const [marking, setMarking] = useState(false);
  const [localAttendance, setLocalAttendance] = useState([]);
  const [msg, setMsg] = useState("");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("name");
  const nav = useNavigate();

  useEffect(() => {
    if (!role) { nav("/"); return; }
    loadData();
  }, [nav, role]);

  const loadData = async () => {
    try {
      const [attRes, studRes] = await Promise.all([
        fetch("/attendance").then(r => r.json()),
        fetch("/students").then(r => r.json())
      ]);
      setRecords(attRes);
      setStudents(studRes);
    } catch {}
  };

  // Teacher: start marking attendance
  const startMarking = () => {
    setMarking(true);
    setLocalAttendance(students.map(s => ({
      studentId: s.id, name: s.name, rollNo: s.rollNo, status: "Present"
    })));
    setMsg("");
  };

  const toggleStatus = (studentId) => {
    setLocalAttendance(prev => prev.map(s =>
      s.studentId === studentId
        ? { ...s, status: s.status === "Present" ? "Absent" : "Present" }
        : s
    ));
  };

  const saveAttendance = async () => {
    if (!newDate || !newSubject) { setMsg("Please select date and subject"); return; }
    try {
      await fetch("/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate, subject: newSubject, records: localAttendance })
      });
      setMsg("✅ Attendance saved!");
      setMarking(false);
      loadData();
    } catch { setMsg("❌ Failed to save"); }
  };

  // Teacher: edit existing record
  const editRecord = (date, subject, studentId, newStatus) => {
    fetch("/attendance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, subject, studentId, status: newStatus })
    }).then(() => loadData());
  };

  // Student view: filter records for this student
  const myRecords = records.map(r => {
    const entry = r.records.find(s => s.name === userName);
    return entry ? { date: r.date, subject: r.subject, status: entry.status } : null;
  }).filter(Boolean);

  const myPresent = myRecords.filter(r => r.status === "Present").length;
  const myTotal = myRecords.length;
  const myPercentage = myTotal > 0 ? Math.round((myPresent / myTotal) * 100) : 0;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <h1>📋 <span>Attendance</span></h1>
          {role === "teacher" && !marking && (
            <button className="btn btn-primary" onClick={startMarking}>✏️ Mark Attendance</button>
          )}
        </div>

        {/* === STUDENT VIEW === */}
        {role === "student" && (
          <>
            <div className="card-grid" style={{ marginBottom: 24 }}>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "rgba(0,210,160,0.15)" }}>✅</div>
                <div className="stat-value">{myPresent}</div>
                <div className="stat-label">Days Present</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "rgba(233,69,96,0.15)" }}>❌</div>
                <div className="stat-value">{myTotal - myPresent}</div>
                <div className="stat-label">Days Absent</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "rgba(108,99,255,0.15)" }}>📊</div>
                <div className="stat-value">{myPercentage}%</div>
                <div className="stat-label">Attendance Rate</div>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead><tr><th>Date</th><th>Subject</th><th>Status</th></tr></thead>
                <tbody>
                  {myRecords.map((r, i) => (
                    <tr key={i}>
                      <td>{r.date}</td>
                      <td>{r.subject}</td>
                      <td>
                        <span className={`badge ${r.status === "Present" ? "badge-success" : "badge-danger"}`}>
                          {r.status === "Present" ? "✅" : "❌"} {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* === TEACHER: MARK NEW === */}
        {role === "teacher" && marking && (
          <div className="card fade-in">
            <h3 style={{ marginBottom: 16 }}>Mark New Attendance</h3>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <div className="form-group" style={{ flex: 1, minWidth: 200 }}>
                <label className="form-label">Date</label>
                <input type="date" className="input" value={newDate}
                  onChange={e => setNewDate(e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 1, minWidth: 200 }}>
                <label className="form-label">Subject</label>
                <select className="input select" value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}>
                  <option>Mathematics</option><option>Physics</option>
                  <option>Chemistry</option><option>Computer Science</option><option>English</option>
                </select>
              </div>
            </div>

            <div className="table-container" style={{ marginBottom: 16 }}>
              <table>
                <thead><tr><th>Roll No</th><th>Name</th><th>Status</th><th>Toggle</th></tr></thead>
                <tbody>
                  {localAttendance.map(s => (
                    <tr key={s.studentId}>
                      <td>{s.rollNo}</td>
                      <td>{s.name}</td>
                      <td>
                        <span className={`badge ${s.status === "Present" ? "badge-success" : "badge-danger"}`}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-secondary" onClick={() => toggleStatus(s.studentId)}>
                          🔄 Toggle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {msg && <p style={{ fontSize: 13, marginBottom: 12, color: msg.startsWith("✅") ? "var(--accent-success)" : "var(--accent-secondary)" }}>{msg}</p>}
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-primary" onClick={saveAttendance}>💾 Save</button>
              <button className="btn btn-danger" onClick={() => setMarking(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* === TEACHER: VIEW/EDIT EXISTING === */}
        {role === "teacher" && !marking && (
          <>
            <h3 style={{ marginBottom: 16, fontSize: 16 }}>Attendance Records</h3>
            {records.map((rec, idx) => (
              <div className="card fade-in" key={idx} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <span className="badge badge-info" style={{ marginRight: 8 }}>{rec.subject}</span>
                    <span className="badge badge-success">{rec.date}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {rec.records.filter(r => r.status === "Present").length}/{rec.records.length} Present
                  </span>
                </div>
                <div className="table-container">
                  <table>
                    <thead><tr><th>Roll No</th><th>Name</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {rec.records.map(s => (
                        <tr key={s.studentId}>
                          <td>{s.rollNo}</td>
                          <td>{s.name}</td>
                          <td>
                            <span className={`badge ${s.status === "Present" ? "badge-success" : "badge-danger"}`}>
                              {s.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-secondary"
                              onClick={() => editRecord(rec.date, rec.subject, s.studentId,
                                s.status === "Present" ? "Absent" : "Present")}>
                              🔄
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <Chatbot />
    </div>
  );
}
