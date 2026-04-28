import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi 👋 I'm your AI study assistant! Ask me anything about your studies.", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { text: input.trim(), sender: "user" };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: newMessages.slice(-10) // send last 10 messages for context
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply, sender: "bot" }]);
    } catch {
      setMessages(prev => [...prev, { text: "⚠️ Cannot reach the server. Please try again.", sender: "bot" }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <button className="chat-toggle" onClick={() => setOpen(!open)} title="AI Assistant">
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="chatbox">
          <div className="chatbox-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>🤖</span>
              <h3>AI Study Assistant</h3>
            </div>
            <button className="close-chat" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading}>🚀</button>
          </div>
        </div>
      )}
    </>
  );
}
