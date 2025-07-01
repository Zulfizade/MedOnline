import React, { useEffect, useState } from "react";
import styles from "./ChatList.module.css";
import axios from "../../redux/axiosInstance";
import { useSelector } from "react-redux";

const ChatList = ({ selectedChat, onSelect }) => {
  const user = useSelector(state => state.user.info);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user || !user._id) return;
    axios.get("/api/chat/all-messages")
      .then(res => {
        const chatMap = {};
        res.data.forEach(msg => {
          if (!msg || !msg.sender || !msg.receiver) return;
          const senderId = msg.sender && msg.sender._id ? msg.sender._id : null;
          const receiverId = msg.receiver && msg.receiver._id ? msg.receiver._id : null;
          if (!senderId || !receiverId) return;
          let other = senderId === user._id ? msg.receiver : msg.sender;
          if (!other || !other._id) return;
          // unread: yalnız qarşı tərəfdən gələn və isRead=false olan mesaj varsa true
          const isUnread = !msg.isRead && senderId !== user._id;
          if (!chatMap[other._id] || new Date(msg.createdAt) > new Date(chatMap[other._id].time)) {
            chatMap[other._id] = {
              id: other._id,
              name: other.name,
              unread: isUnread,
              lastMessage: msg.message,
              time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              avatar: other.profilePhoto
                ? `http://localhost:9012/uploads/profile_photos/${other.profilePhoto}`
                : "/default-avatar.png",
              model: other.role === "doctor" ? "Doctor" : "Patient",
              msgId: msg._id // son mesajın id-si
            };
          }
        });
        setChats(Object.values(chatMap));
      });
  }, [user]);

  return (
    <div className={styles.chatList}>
      <h3 className={styles.title}>Söhbətlər</h3>
      <ul className={styles.list}>
        {chats.length === 0 && (
          <li className={styles.empty}>Heç bir mesaj yoxdur</li>
        )}
        {chats.map((chat, idx) => {
          if (!chat || !chat.id) return null;
          const handleClick = async () => {
            if (chat.unread && chat.msgId) {
              // Mesajı oxundu kimi işarələ
              await axios.patch(`/api/chat/read/${chat.msgId}`);
              // Local olaraq oxundu kimi işarələ
              setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: false } : c));
            }
            onSelect(chat);
          };
          return (
            <li
              key={chat.id || idx}
              className={`${styles.item} ${chat.unread ? styles.unread : ""} ${selectedChat === chat.id ? styles.selected : ""}`}
              onClick={handleClick}
            >
              <img src={chat.avatar} alt={chat.name} className={styles.avatar} />
              <div className={styles.info}>
                <div className={styles.name} style={{ fontWeight: chat.unread ? 700 : 500 }}>
                  {chat.name}
                </div>
                <div className={styles.lastMessage}>{chat.lastMessage}</div>
              </div>
              <div className={styles.meta}>
                <span className={styles.time}>{chat.time}</span>
                {chat.unread && <span className={styles.unreadDot}></span>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;