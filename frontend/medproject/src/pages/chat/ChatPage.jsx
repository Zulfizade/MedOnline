import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import styles from "./ChatPage.module.css";
import { useLocation, Link } from "react-router";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  const location = useLocation();

  // URL-dən ?with=...&model=... oxu və ilkin chat seç
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const withId = params.get("with");
    const model = params.get("model");
    if (withId && model) {
      setSelectedChat({ id: withId, model });
    }
  }, [location.search]);

  // Yeni chat əlavə etmək üçün callback
  const handleNewChat = (chat) => {
    setChatList((prev) => {
      if (!prev.find((c) => c.id === chat.id)) {
        return [...prev, chat];
      }
      return prev;
    });
  };

  return (
    <div className={styles.chatPage}>
      <Link to="/" className={styles.homeBtn}>
        <i className="fa fa-home"></i> Ana səhifə
      </Link>
      <div className={styles.chatListSection}>
        <ChatList
          selectedChat={selectedChat?.id}
          onSelect={setSelectedChat}
          chatList={chatList}
          setChatList={setChatList}
        />
      </div>
      <div className={styles.chatWindowSection}>
        <ChatWindow chat={selectedChat} onNewChat={handleNewChat} />
      </div>
    </div>
  );
};

export default ChatPage;