const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "uploads"));
}

// ===== LOGIN =====
const users = [
  { email: "teacher@gmail.com", password: "123", role: "teacher", name: "Prof. Sharma" },
  { email: "student@gmail.com", password: "123", role: "student", name: "Jasmeen Sharma" },
  { email: "teacher2@gmail.com", password: "123", role: "teacher", name: "Dr. Kapoor" },
  { email: "student2@gmail.com", password: "123", role: "student", name: "Ravi Kumar" }
];

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    return res.json({ role: user.role, name: user.name, email: user.email });
  }
  res.status(400).json({ msg: "Invalid credentials" });
});

// ===== FILE UPLOAD (Notes) =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// In-memory notes store
let notes = [
  {
    id: 1, title: "Introduction to Mathematics", subject: "Mathematics",
    uploadedBy: "Prof. Sharma", date: "2026-04-25", filename: null, originalName: "math_intro.pdf"
  },
  {
    id: 2, title: "Physics Chapter 1 - Mechanics", subject: "Physics",
    uploadedBy: "Dr. Kapoor", date: "2026-04-24", filename: null, originalName: "physics_ch1.pdf"
  }
];
let noteIdCounter = 3;

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });
  const newNote = {
    id: noteIdCounter++,
    title: req.body.title || req.file.originalname,
    subject: req.body.subject || "General",
    uploadedBy: req.body.uploadedBy || "Teacher",
    date: new Date().toISOString().split("T")[0],
    filename: req.file.filename,
    originalName: req.file.originalname
  };
  notes.push(newNote);
  res.json({ msg: "Uploaded successfully", note: newNote });
});

app.get("/notes", (req, res) => res.json(notes));

app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return res.status(404).json({ msg: "Note not found" });
  const note = notes[idx];
  if (note.filename) {
    const fp = path.join(__dirname, "uploads", note.filename);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  notes.splice(idx, 1);
  res.json({ msg: "Deleted" });
});

app.get("/download/:filename", (req, res) => {
  const fp = path.join(__dirname, "uploads", req.params.filename);
  if (fs.existsSync(fp)) res.download(fp);
  else res.status(404).json({ msg: "File not found" });
});

// ===== ATTENDANCE =====
const studentsList = [
  { id: 1, name: "Jasmeen Sharma", rollNo: "CS-001" },
  { id: 2, name: "Ravi Kumar", rollNo: "CS-002" },
  { id: 3, name: "Priya Patel", rollNo: "CS-003" },
  { id: 4, name: "Amit Singh", rollNo: "CS-004" },
  { id: 5, name: "Neha Gupta", rollNo: "CS-005" },
  { id: 6, name: "Saurabh Joshi", rollNo: "CS-006" },
  { id: 7, name: "Kavita Verma", rollNo: "CS-007" },
  { id: 8, name: "Manish Agarwal", rollNo: "CS-008" }
];

let attendanceRecords = [
  {
    date: "2026-04-25", subject: "Mathematics",
    records: [
      { studentId: 1, name: "Jasmeen Sharma", rollNo: "CS-001", status: "Present" },
      { studentId: 2, name: "Ravi Kumar", rollNo: "CS-002", status: "Present" },
      { studentId: 3, name: "Priya Patel", rollNo: "CS-003", status: "Absent" },
      { studentId: 4, name: "Amit Singh", rollNo: "CS-004", status: "Present" },
      { studentId: 5, name: "Neha Gupta", rollNo: "CS-005", status: "Present" },
      { studentId: 6, name: "Saurabh Joshi", rollNo: "CS-006", status: "Absent" },
      { studentId: 7, name: "Kavita Verma", rollNo: "CS-007", status: "Present" },
      { studentId: 8, name: "Manish Agarwal", rollNo: "CS-008", status: "Present" }
    ]
  },
  {
    date: "2026-04-26", subject: "Physics",
    records: [
      { studentId: 1, name: "Jasmeen Sharma", rollNo: "CS-001", status: "Present" },
      { studentId: 2, name: "Ravi Kumar", rollNo: "CS-002", status: "Absent" },
      { studentId: 3, name: "Priya Patel", rollNo: "CS-003", status: "Present" },
      { studentId: 4, name: "Amit Singh", rollNo: "CS-004", status: "Present" },
      { studentId: 5, name: "Neha Gupta", rollNo: "CS-005", status: "Absent" },
      { studentId: 6, name: "Saurabh Joshi", rollNo: "CS-006", status: "Present" },
      { studentId: 7, name: "Kavita Verma", rollNo: "CS-007", status: "Present" },
      { studentId: 8, name: "Manish Agarwal", rollNo: "CS-008", status: "Present" }
    ]
  }
];

app.get("/students", (req, res) => res.json(studentsList));
app.get("/attendance", (req, res) => res.json(attendanceRecords));

app.post("/attendance", (req, res) => {
  const { date, subject, records } = req.body;
  const idx = attendanceRecords.findIndex(a => a.date === date && a.subject === subject);
  if (idx >= 0) attendanceRecords[idx].records = records;
  else attendanceRecords.push({ date, subject, records });
  res.json({ msg: "Attendance saved" });
});

app.put("/attendance", (req, res) => {
  const { date, subject, studentId, status } = req.body;
  const record = attendanceRecords.find(a => a.date === date && a.subject === subject);
  if (!record) return res.status(404).json({ msg: "Record not found" });
  const student = record.records.find(r => r.studentId === studentId);
  if (!student) return res.status(404).json({ msg: "Student not found" });
  student.status = status;
  res.json({ msg: "Updated" });
});

// ===== REPORT =====
app.get("/report", (req, res) => {
  const report = studentsList.map(student => {
    let totalClasses = 0, present = 0;
    attendanceRecords.forEach(record => {
      const entry = record.records.find(r => r.studentId === student.id);
      if (entry) { totalClasses++; if (entry.status === "Present") present++; }
    });
    return {
      ...student, totalClasses, present,
      absent: totalClasses - present,
      percentage: totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 0
    };
  });
  res.json(report);
});

// ===== AI CHATBOT (Gemini 3.1 Flash Preview) =====
app.post("/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ msg: "No message" });

  const apiKey = process.env.GEMINI_API_KEY;

  // If no valid API key, use built-in smart replies
  if (!apiKey || apiKey.length < 10 || apiKey.startsWith("your-")) {
    return res.json({ reply: getSmartReply(message) });
  }

  try {
    const { GoogleGenAI } = require("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    // Build conversation contents
    let contents = [];

    // Add history if provided
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: contents,
      config: {
        systemInstruction: `You are an intelligent AI assistant for a college/school student portal called "EduNotes Portal". 
You help students and teachers with academic questions, study tips, concept explanations, homework help, and general knowledge.
Be friendly, helpful, and encouraging. Use emojis occasionally. Keep answers concise but thorough.`,
        maxOutputTokens: 500,
        temperature: 0.7
      }
    });

    const reply = response.text;
    res.json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    res.json({ reply: getSmartReply(message) });
  }
});

// Smart built-in reply system (fallback when no API key)
function getSmartReply(message) {
  const msg = message.toLowerCase().trim();
  if (msg.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/))
    return "Hello! 👋 Welcome to EduNotes Portal. How can I help you today?";
  if (msg.match(/(math|algebra|calculus|geometry|equation|trigonometry)/))
    return "📐 Great question about math!\n\n1. **Practice regularly** - Math improves with practice\n2. **Understand concepts** before memorizing formulas\n3. **Work through examples** step by step\n\nWhat specific topic would you like help with?";
  if (msg.match(/(science|physics|chemistry|biology)/))
    return "🔬 Science is fascinating!\n\n1. **Understand the fundamentals**\n2. **Visualize concepts** with diagrams\n3. **Connect theory to real life**\n\nWhich science topic interests you?";
  if (msg.match(/(programming|coding|python|java|javascript|code|computer)/))
    return "💻 Programming is an amazing skill!\n\n1. **Start with basics** - variables, loops, functions\n2. **Practice daily** - even 30 minutes helps\n3. **Build projects** - learning by doing is best\n\nWhich language are you working with?";
  if (msg.match(/(study|exam|test|preparation|tips|learn)/))
    return "📚 Proven study strategies:\n\n1. **Pomodoro Technique** - 25 min study, 5 min break\n2. **Active Recall** - test yourself\n3. **Spaced Repetition** - review at intervals\n4. **Mind Maps** - visualize connections\n\nWould you like more specific advice?";
  if (msg.match(/(notes|download|upload|material)/))
    return "📝 Navigate to the Notes page from the sidebar to browse and download notes. Teachers can upload via the Upload section!";
  if (msg.match(/(attendance|present|absent)/))
    return "📋 Teachers can mark/edit attendance. Students can view their records. Check the Attendance section in the sidebar!";
  if (msg.match(/(thank|thanks)/))
    return "You're welcome! 😊 Happy studying! 📖✨";
  if (msg.match(/(bye|goodbye|see you)/))
    return "Goodbye! 👋 Good luck with your studies! 🌟";
  if (msg.match(/(who are you|what are you|your name)/))
    return "🤖 I'm the **EduNotes AI Assistant**! I help with academic questions, study tips, and portal navigation.";
  return "🤔 Interesting question! I can help with Math, Science, Programming, Study tips & Portal navigation. Could you tell me more about what you need?";
}

// Serve Frontend Build
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));