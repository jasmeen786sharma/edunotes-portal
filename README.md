# 📘 EduNotes Portal

A premium, role-based educational portal designed for students and teachers. Featuring a modern Apple VisionOS theme, real-time attendance tracking, secure notes sharing, and an intelligent study assistant powered by **Google Gemini 3.1 Flash Preview**.

## ✨ Features

- **🔒 Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for Teachers and Students.
- **📚 Notes Management**: Teachers can upload study materials (PDFs, Docs, etc.), and students can browse and download them.
- **📋 Attendance Tracking**: Teachers can mark and update daily attendance. Students get a real-time view of their attendance percentage.
- **📈 Progress & Reports**: Interactive charts (using Chart.js) visualizing student performance and comprehensive tabular reports.
- **🤖 AI Study Assistant**: An integrated floating chatbot powered by the latest `@google/genai` SDK and the `gemini-3.1-flash-preview` model to answer academic questions.
- **🎨 Premium UI/UX**: Beautiful glassmorphism design, smooth animations, and a cohesive dark theme built from scratch with pure CSS.

## 🛠️ Technology Stack

- **Frontend**: React.js, React Router DOM, Chart.js
- **Backend**: Node.js, Express.js, Multer (File Uploads)
- **AI Integration**: Google Gen AI SDK (`@google/genai`)
- **Styling**: Vanilla CSS with customized tokens

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher recommended)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AsthaChandel123/edunotes-portal.git
   cd edunotes-portal
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=5000
   ```
   Start the backend server:
   ```bash
   node server.js
   ```

3. **Frontend Setup:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   Start the React development server:
   ```bash
   npm start
   ```

## 🔐 Demo Credentials

Use these credentials to log in and explore the portal:

**Teacher Account**
- **Email:** `teacher@gmail.com`
- **Password:** `123`

**Student Account**
- **Email:** `student@gmail.com`
- **Password:** `123`
