import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../../redux/reducers/userSlice";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import styles from "./ChatPage.module.css";
import { useLocation, Link } from "react-router";


const ChatPage = () => {
  const dispatch = useDispatch();
  const { info: user, loading: userLoading, error: userError } = useSelector(state => state.user);
  // LocalStorage ilə chatList və selectedChat-i saxla
  const [selectedChat, setSelectedChat] = useState(() => {
    try {
      const saved = localStorage.getItem("selectedChat");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [chatList, setChatList] = useState(() => {
    try {
      const saved = localStorage.getItem("chatList");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const location = useLocation();

  // Refresh zamanı user yoxdursa, fetch et
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
    // eslint-disable-next-line
  }, []);

  // URL-dən ?with=...&model=... oxu və ilkin chat seç
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const withId = params.get("with");
    const model = params.get("model");
    if (withId && model) {
      setSelectedChat({ id: withId, model });
      localStorage.setItem("selectedChat", JSON.stringify({ id: withId, model }));
    }
  }, [location.search]);

  // selectedChat və chatList dəyişəndə localStorage-a yaz
  useEffect(() => {
    if (selectedChat) {
      localStorage.setItem("selectedChat", JSON.stringify(selectedChat));
    }
  }, [selectedChat]);
  useEffect(() => {
    localStorage.setItem("chatList", JSON.stringify(chatList));
  }, [chatList]);

  // Yeni chat əlavə etmək üçün callback
  const handleNewChat = (chat) => {
    setChatList((prev) => {
      if (!prev.find((c) => c.id === chat.id)) {
        return [...prev, chat];
      }
      return prev;
    });
  };

  if (userLoading || !user) {
    return <div style={{textAlign:'center',marginTop:60,fontSize:18,color:'#2749ce'}}>Yüklənir...</div>;
  }
  if (userError) {
    return <div style={{textAlign:'center',marginTop:60,fontSize:18,color:'red'}}>{userError}</div>;
  }
  return (
    <div className={styles.chatPage}>
      <Link to="/" className={styles.homeBtn}>
        <i className="fa fa-home"></i> Ana səhifə
      </Link>
      <div className={styles.chatListSection}>
        <ChatList
          selectedChat={selectedChat?.id}
          onSelect={(chat) => {
            setSelectedChat(chat);
            localStorage.setItem("selectedChat", JSON.stringify(chat));
          }}
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