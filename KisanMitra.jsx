// src/pages/KisanMitra.jsx
import React, { useEffect, useRef, useState } from "react";
import "../styles/KisanMitra.css";
import kisanBot from "../assets/kisanbot.jpg"; 






const BACKEND_URL = "http://localhost:8000/chat";

export default function KisanMitra() {
  const [messages, setMessages] = useState([
    {
      id: 0,
      sender: "bot",
      text: "Hello! I'm your Kisan Mitra. I can help you predict crop yields, recommend suitable crops for your land, analyze soil conditions, and provide weather-based farming insights. How can I assist you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");

  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const nextIdRef = useRef(1);

  // scroll on new messages
  useEffect(() => {
    const el = chatBoxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;

      recognitionRef.current = recog;

      recog.onstart = () => setListening(true);
      recog.onresult = (e) => setInput(e.results[0][0].transcript || "");
      recog.onerror = () => setListening(false);
      recog.onend = () => {
        setListening(false);
        if (input.trim() !== "") sendMessage();
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function pushMessage(text, sender = "bot") {
    setMessages((prev) => [
      ...prev,
      { id: nextIdRef.current++, sender, text },
    ]);
  }

  async function sendMessage(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    pushMessage(text, "user");
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      pushMessage(data.text || "(no reply)", "bot");

      if (data.audioData) {
        const raw = data.audioData;
        const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        new Audio(url).play();
      }
    } catch (err) {
      pushMessage("⚠ Error connecting to server", "bot");
    }

    setLoading(false);
  }

  function toggleMic() {
    const rec = recognitionRef.current;
    if (!rec) return;

    if (listening) {
      try {
        rec.stop();
      } catch {}
      setListening(false);
    } else {
      rec.lang =
        language === "hi"
          ? "hi-IN"
          : language === "bn"
          ? "bn-IN"
          : language === "pa"
          ? "pa-IN"
          : "en-US";

      try {
        rec.start();
      } catch {}
    }
  }

  // QUICK ACTION CONFIG WITH ICONS
  const quickActions = [
    {
      label: "Predict Yield",
      prompt: "Predict crop yield for my current field and season.",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M4 18h4l4.5-6 3 4 4.5-7" />
          <path d="M17 5h4v4" />
        </svg>
      ),
    },
    {
      label: "Soil Analysis",
      prompt: "Analyze my soil and suggest how I can improve it.",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 3C9 7 6 9.5 6 13a6 6 0 0 0 12 0c0-3.5-3-6-6-10z" />
          <path d="M10 14h4" />
        </svg>
      ),
    },
    {
      label: "Weather Impact",
      prompt: "How will the upcoming weather affect my crops?",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M7 17a5 5 0 0 1 0-10 5.5 5.5 0 0 1 10.4-1.7A4.5 4.5 0 1 1 19 17H7z" />
        </svg>
      ),
    },
    {
      label: "Crop Recommendation",
      prompt: "Recommend the best crops for my land and region.",
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
  ];

  function handleQuickAction(prompt) {
    sendMessage(prompt);
  }

  return (
    <div className="km-root">
      <div className="km-shell">
        {/* HEADER */}
        <header className="km-header">
          <div className="km-header-left">
            <div className="km-avatar">
               <img
                  src={kisanBot}
                  alt="Kisan Mitra Bot"
                  className="km-avatar-img"
               />
           </div>


            <div className="km-header-text">
              <div className="km-title">Kisan Mitra</div>
              <div className="km-subtitle">Your intelligent farming companion</div>
            </div>
          </div>

          <div className="km-header-right">
            <div className="km-lang-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.93 9h-3.12a15.6 15.6 0 0 0-1.16-5.01A8.03 8.03 0 0 1 19.93 11zM12 4a13.6 13.6 0 0 1 1.76 6H10.24A13.6 13.6 0 0 1 12 4zM8.35 6.99A15.6 15.6 0 0 0 7.19 11H4.07a8.03 8.03 0 0 1 4.28-4.01zM4.07 13h3.12a15.6 15.6 0 0 0 1.16 5.01A8.03 8.03 0 0 1 4.07 13zm5.17 0h3.52A13.6 13.6 0 0 1 12 20a13.6 13.6 0 0 1-2.76-7zm5.41 5.01A15.6 15.6 0 0 0 16.81 13h3.12a8.03 8.03 0 0 1-4.28 5.01z" />
              </svg>
            </div>
            <select
              className="km-lang-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>
        </header>

        {/* CHAT */}
        <div className="km-chat" ref={chatBoxRef}>
          {messages.map((msg) => (
  <div
    key={msg.id}
    className={`km-msg-row ${
      msg.sender === "user" ? "km-msg-user" : "km-msg-bot"
    }`}
  >
    {/* Bot Icon */}
    {msg.sender === "bot" && (
      <div className="km-msg-icon bot-icon">🌱</div>
    )}

    <div className="km-msg-bubble">
      <div className="km-msg-text">{msg.text}</div>
      <div className="km-msg-time">
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>

    {/* User Icon */}
    {msg.sender === "user" && (
      <div className="km-msg-icon user-icon">👤</div>
    )}
  </div>
))}

        </div>

        {/* QUICK ACTIONS */}
        <div className="km-quick-actions">
          <span className="km-qa-label">Quick actions:</span>
          <div className="km-qa-buttons">
            {quickActions.map((qa) => (
              <button
                key={qa.label}
                className="km-qa-btn"
                onClick={() => handleQuickAction(qa.prompt)}
                disabled={loading}
              >
                <span className="km-qa-icon">{qa.icon}</span>
                <span className="km-qa-text">{qa.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* INPUT BAR */}
        <div className="km-input-row">
          <input
            className="km-input"
            type="text"
            value={input}
            placeholder={
              loading
                ? "Wait..."
                : "Ask about crop predictions, soil analysis, weather..."
            }
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />

          <button
            className={`km-icon-btn ${listening ? "km-mic-listening" : ""}`}
            onClick={toggleMic}
            type="button"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM11 19h2v3h-2v-3z" />
            </svg>
          </button>

          <button
            className="km-icon-btn km-send-btn"
            onClick={() => sendMessage()}
            disabled={loading}
            type="button"
          >
            <svg viewBox="0 0 24 24">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
