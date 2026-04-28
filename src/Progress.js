import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend
} from "chart.js";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function Progress() {
  const role = localStorage.getItem("role");
  const nav = useNavigate();

  useEffect(() => { if (!role) nav("/"); }, [nav, role]);

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Attendance %",
        data: [72, 78, 85, 80, 88, 83],
        borderColor: "#6c63ff",
        backgroundColor: "rgba(108, 99, 255, 0.1)",
        fill: true, tension: 0.4, pointRadius: 5,
        pointBackgroundColor: "#6c63ff"
      },
      {
        label: "Assignment Score",
        data: [65, 70, 75, 82, 78, 85],
        borderColor: "#00d2a0",
        backgroundColor: "rgba(0, 210, 160, 0.1)",
        fill: true, tension: 0.4, pointRadius: 5,
        pointBackgroundColor: "#00d2a0"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#a0a0b8", font: { family: "Inter" } } },
      tooltip: { backgroundColor: "#1a1a2e", titleColor: "#e8e8f0", bodyColor: "#a0a0b8" }
    },
    scales: {
      x: { ticks: { color: "#6c6c8a" }, grid: { color: "rgba(108,99,255,0.08)" } },
      y: { ticks: { color: "#6c6c8a" }, grid: { color: "rgba(108,99,255,0.08)" }, min: 0, max: 100 }
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar"><h1>📈 <span>Progress</span></h1></div>
        <div className="card" style={{ maxWidth: 800 }}>
          <h3 style={{ fontSize: 16, marginBottom: 20 }}>Performance Trends</h3>
          <Line data={data} options={options} />
        </div>
      </div>
      <Chatbot />
    </div>
  );
}