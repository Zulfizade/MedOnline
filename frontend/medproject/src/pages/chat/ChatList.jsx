import React, { useEffect, useState } from "react";
import styles from "./ChatList.module.css";
import axios from "../../redux/axiosInstance";
import { useSelector } from "react-redux";

const ChatList = ({ selectedChat, onSelect }) => {
  const user = useSelector(state => state.user.info);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios.get("/api/chat/notifications/all")
      .then(res => {
        const chatMap = {};
        res.data.forEach(msg => {
          // Qarşı tərəfi tap: əgər göndərən mənə bərabərdirsə, qarşı tərəf receiver-dir, əks halda sender-dir
          let other = msg.sender._id === user._id ? msg.receiver : msg.sender;
          if (!chatMap[other._id]) {
            chatMap[other._id] = {
              id: other._id,
              name: other.name,
              unread: !msg.isRead && msg.sender._id !== user._id, // yalnız qarşı tərəfdən gələn oxunmamış mesajlar
              lastMessage: msg.message,
              time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              avatar: other.profilePhoto
                ? `http://localhost:9012/uploads/profile_photos/${other.profilePhoto}`
                : "/default-avatar.png",
              model: other.role === "doctor" ? "Doctor" : "Patient",
            };
          } else {
            // Əgər artıq chat varsa, son mesajı və oxunmamış statusunu yenilə
            if (new Date(msg.createdAt) > new Date(chatMap[other._id].time)) {
              chatMap[other._id].lastMessage = msg.message;
              chatMap[other._id].time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            if (!msg.isRead && msg.sender._id !== user._id) {
              chatMap[other._id].unread = true;
            }
          }
        });
        setChats(Object.values(chatMap));
      });
  }, [user._id]);

  return (
    <div className={styles.chatList}>
      <h3 className={styles.title}>Söhbətlər</h3>
      <ul className={styles.list}>
        {chats.length === 0 && (
          <li className={styles.empty}>Heç bir mesaj yoxdur</li>
        )}
        {chats.map(chat => (
          <li
            key={chat.id}
            className={`${styles.item} ${chat.unread ? styles.unread : ""} ${selectedChat === chat.id ? styles.selected : ""}`}
            onClick={() => onSelect(chat)}
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
        ))}
      </ul>
    </div>
  );
};

export default ChatList;