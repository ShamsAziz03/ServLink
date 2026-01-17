import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/messages.css";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";

const COLORS = {
  primary: "#6c3483",
  secondary: "#b57edc",
  background: "#f6f1fa",
  card: "#ffffff",
  text: "#2e1a33",
  muted: "#9b8ca6",
  border: "#e5dff0",
};

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [simplifiedReply, setSimplifiedReply] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const ip = "localhost";

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://${ip}:5000/api/get_contact_messages`);
      setMessages(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const sendReply = async () => {
    if (!reply.trim()) return;
    try {
      await axios.post(`http://${ip}:5000/api/contact_reply`, {
        contact_id: selected.id,
        reply,
      });

      if (selected.user_id) {
        await axios.post(`http://${ip}:5000/api/users/send-notification`, {
          userId: selected.user_id,
          title: "New Reply 💬",
          message: reply,
        });
      }

      setReply("");
      setSimplifiedReply("");
      setSuggestions([]);
      setModalVisible(false);
      fetchMessages();
    } catch (err) {
      console.error("Error sending reply or notification:", err);
    }
  };

  // Generate AI reply suggestions
  const generateSuggestions = async () => {
    if (!selected) return;
    try {
      const res = await axios.post(`http://${ip}:5000/api/ai/generate_reply_suggestions`, {
        message: selected.message,
      });
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error("Error generating suggestions:", err);
    }
  };

  // Simplify current reply
  const simplifyReply = async () => {
    if (!reply.trim()) return;
    try {
      const res = await axios.post(`http://${ip}:5000/api/ai/simplify_reply`, {
        text: reply,
      });
      setSimplifiedReply(res.data.simplified || "");
    } catch (err) {
      console.error("Error simplifying reply:", err);
    }
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>Contact Messages</h1>
        <p>Manage & reply to user inquiries</p>
      </div>

      <div className="contact-list">
        {messages.map((item) => (
          <div
            key={item.id}
            className="messages-card"
            onClick={() => {
              setSelected(item);
              setReply(""); 
              setSimplifiedReply(""); 
              setSuggestions([]);
              setModalVisible(true);
            }}
          >
            <div className="contact-row">
              <FaUserCircle size={36} color={COLORS.primary} />
              <div className="contact-info">
                <span className="contact-name">{item.name}</span>
                <span className="contact-email">{item.email}</span>
              </div>
              {!item.replied && <span className="unread-dot"></span>}
            </div>
            <p className="contact-message">{item.message}</p>
            <span className="contact-date">{item.created_at}</span>
          </div>
        ))}
      </div>

      {modalVisible && selected && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="reply-card" onClick={(e) => e.stopPropagation()}>
            <h2>Reply to Message</h2>
            <p className="modal-name">{selected.name}</p>
            <p className="modal-message">{selected.message}</p>

            {/* Textarea for reply */}
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply..."
              className="modal-textarea"
            />

            {/* Buttons for AI features */}
            <div className="modal-ai-buttons">
              <button onClick={generateSuggestions}>AI-Suggested Replies 🤖</button>
              <button onClick={simplifyReply}>Enhance Your Message with AI ✨</button>
            </div>

            {/* Show AI suggestions */}
            {suggestions.length > 0 && (
              <div className="suggestions">
                <p>Suggested Replies:</p>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => setReply(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Show simplified reply */}
            {simplifiedReply && (
              <div className="simplified-output">
                <p>Simplified version:</p>
                <button onClick={() => setReply(simplifiedReply)}>
                  {simplifiedReply}
                </button>
              </div>
            )}

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setModalVisible(false)}>
                Cancel
              </button>
              <button className="send-btn" onClick={sendReply}>
                <FaPaperPlane /> Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
