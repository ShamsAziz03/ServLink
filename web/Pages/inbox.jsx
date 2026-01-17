import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoArrowBack, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "../css/inbox.css";

const COLORS = {
  primary: "#6c3483",
  secondary: "#b57edc",
  background: "#f6f1fa",
  card: "#fff",
  text: "#2e1a33",
  muted: "#9b8ca6",
};

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigate = useNavigate();
  const ip = "localhost";

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = JSON.parse(storedUser);
      const userId = user.user_id;
      const res = await axios.get(
        `http://${ip}:5000/api/users/user_inbox/${userId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const markAsRead = async (replyId) => {
    if (!replyId) return;
    try {
      await axios.put(`http://${ip}:5000/api/users/mark-read/${replyId}`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.reply_id === replyId ? { ...msg, read: 1 } : msg
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="inbox-container">
      <div className="header_inbox">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <IoArrowBack size={24} color="#fff" />
        </button>
        <h2 className="header-title-inbox">Inbox</h2>
      </div>

      <div className="messages-list">
        {messages.map((item) => (
          <div
            key={item.reply_id}
            className="card"
            onClick={() => {
              setSelected(item);
              setModalVisible(true);
            }}
          >
            <div className="row">
              <IoChatbubbleEllipsesOutline size={28} color={COLORS.primary} />
              <div className="text-col">
                <h3 className="title">{item.reply_title || "Admin Reply"}</h3>
                <p className="preview">{item.reply || "No reply yet..."}</p>
              </div>
              {!item.read && <span className="dot" />}
            </div>
            <p className="date">{new Date(item.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {modalVisible && selected && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-title">{selected.reply_title || "Admin Reply"}</h3>
            <p className="modal-content">{selected.reply || "No reply yet"}</p>
            <button
              className="close-btn"
              onClick={() => {
                markAsRead(selected.reply_id);
                setModalVisible(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
