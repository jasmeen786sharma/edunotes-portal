# 📘 EduNotes Portal

A premium, role-based educational portal designed for students and teachers. Featuring a modern Apple VisionOS-inspired glassmorphism theme, real-time attendance tracking, secure notes sharing, and an intelligent study assistant powered by **Google Gemini 1.5 Flash**.

### 🚀 Live Demo
**Website:** [https://edunotes-portal-jasmeen786sharma.onrender.com/](https://edunotes-portal-jasmeen786sharma.onrender.com/)

---

## ✨ Key Features

- **🔒 Role-Based Access Control (RBAC)**: Distinct dashboards and specific permissions for Teachers and Students.
- **🤖 AI Study Assistant**: An integrated floating chatbot powered by the `@google/genai` SDK and the `gemini-1.5-flash` model to answer academic questions instantly.
- **📚 Notes Management**: Teachers can upload study materials (PDFs, Docs, etc.), and students can browse and download them.
- **📋 Attendance Tracking**: Teachers can mark and update daily attendance. Students get a real-time view of their attendance percentage.
- **📈 Progress & Reports**: Interactive charts (using Chart.js) visualizing student performance and comprehensive tabular reports.
- **🎨 Premium UI/UX**: Beautiful glassmorphism design, smooth animations, and a cohesive dark theme built with pure CSS.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, React Router DOM, Chart.js
- **Backend**: Node.js, Express.js, Multer (File Uploads)
- **Database**: MongoDB (via Mongoose ODM)
- **AI Integration**: Google Gen AI SDK (`@google/genai`)
- **Styling**: Vanilla CSS with customized design tokens

---

## 🔐 Demo Credentials

Use these credentials to log in and explore the portal:

**Teacher Account**
- **Email:** `teacher@gmail.com`
- **Password:** `123`

**Student Account**
- **Email:** `student@gmail.com`
- **Password:** `123`

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v20 or higher)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jasmeen786sharma/edunotes-portal.git
   cd edunotes-portal
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```
   Start the backend:
   ```bash
   node server.js
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

---

## 📝 License
This project is for educational purposes.
