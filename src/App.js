import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Notes from "./Notes";
import Upload from "./Upload";
import Progress from "./Progress";
import Attendance from "./Attendance";
import Report from "./Report";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;