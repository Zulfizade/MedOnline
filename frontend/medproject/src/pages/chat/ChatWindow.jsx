import React, { useEffect, useRef, useState } from "react";
import styles from "./ChatWindow.module.css";
import axios from "../../redux/axiosInstance";
import { useSelector } from "react-redux";

const ChatWindow = ({ chat, onNewChat }) => {
  const user = useSelector(state => state.user.info);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chat) return;
    // Mesajları çək
    axios.get(`/api/chat/${chat.id}/${chat.model}`)
      .then(res => setMessages(res.data));
    // Mesajları oxundu kimi işarələ
    // (Backenddə ayrıca endpoint varsa istifadə et)
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chat) return;
    try {
      const res = await axios.post("/api/chat/send", {
        receiverId: chat.id,
        message: input,
      });
      setMessages(prev => [...prev, { ...res.data.newMessage, sender: user._id, senderModel: user.role }]);
      setInput("");
      // İlk dəfə mesaj yazılırsa, yeni chat callback-i çağır
      if (onNewChat) {
        onNewChat({
          id: chat.id,
          name: res.data.receiver?.name || "Yeni istifadəçi",
          model: chat.model,
          avatar: res.data.receiver?.profilePhoto
            ? `http://localhost:9012/uploads/profile_photos/${res.data.receiver.profilePhoto}`
            : "/default-avatar.png",
        });
      }
    } catch {
      // error handling
    }
  };

  if (!chat) {
    return (
      <div className={styles.emptyChat}>
        Söhbət seçin və ya yeni mesaj göndərin.
        <form className={styles.inputBar} onSubmit={e => e.preventDefault()}>
          <input type="text" placeholder="Mesaj yazın..." disabled />
          <button type="submit" disabled>
            <i className="fa fa-paper-plane"></i>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <span className={styles.chatWith}>{chat.name || "İstifadəçi"}</span>
      </div>
      <div className={styles.messages}>
        {messages.map(msg => (
          <div
            key={msg._id || msg.id}
            className={msg.sender === user._id ? styles.myMessage : styles.theirMessage}
          >
            <span>{msg.message}</span>
            <span className={styles.time}>
              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className={styles.inputBar} onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Mesaj yazın..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit">
          <i className="fa fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;