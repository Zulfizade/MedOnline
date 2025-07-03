import React, { useEffect, useState } from "react";
import axios from "../../../redux/axiosInstance";
import styles from "./AdminContactMessages.module.css";
import { toast } from 'react-toastify';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("/api/contact");
        setMessages(res.data);
      } catch {
        setError("Mesajlar yüklənmədi");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleReply = async (id) => {
    setReplyLoading(true);
    try {
      await axios.post(`/api/contact/reply/${id}`, { reply });
      toast.success("Cavab göndərildi!");
      setReply("");
      setSelected(null);
    } catch {
      toast.error("Cavab göndərilmədi");
    } finally {
      setReplyLoading(false);
    }
  };
  if (loading) return <div>Yüklənir...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Əlaqə Mesajları</h2>
      <div className={styles.messagesList}>
        {messages.length === 0 && <div>Heç bir mesaj yoxdur.</div>}
        {messages.map((msg) => (
          <div key={msg._id} className={styles.messageCard}>
            <div className={styles.messageHeader}><b>Ad:</b> {msg.name}</div>
            <div className={styles.messageInfo}><b>Email:</b> {msg.email}</div>
            <div className={styles.messageInfo}><b>Telefon:</b> {msg.number}</div>
            <div className={styles.messageInfo}><b>Mövzu:</b> {msg.subject}</div>
            <div className={styles.messageText}><b>Mesaj:</b> {msg.message}</div>
            <div className={styles.messageInfo}><b>Tarix:</b> {new Date(msg.createdAt).toLocaleString()}</div>
            {msg.reply && (
              <div className={styles.replyBlock}>
                <b>Cavab:</b> {msg.reply}
                <div><b>Cavab Tarixi:</b> {new Date(msg.replyAt).toLocaleString()}</div>
              </div>
            )}
            {!msg.reply && (
              <>
                {selected === msg._id ? (
                  <div className={styles.replyBlock}>
                    <textarea
                      className={styles.textarea}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Cavabınızı yazın..."
                    />
                    <button className={styles.button} onClick={() => handleReply(msg._id)} disabled={replyLoading || !reply}>
                      {replyLoading ? "Göndərilir..." : "Cavab Göndər"}
                    </button>
                    <button className={styles.button} onClick={() => setSelected(null)}>Bağla</button>
                  </div>
                ) : (
                  <button className={styles.button} onClick={() => setSelected(msg._id)}>Cavab ver</button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContactMessages;
