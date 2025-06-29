import React, { useState } from "react";
import axios from "axios";
import styles from "./Profile.module.css";

const Modal = ({ email, onClose }) => {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/profile/verify-email", { code });
      setMsg("Email təsdiqləndi!");
      setTimeout(onClose, 1200);
    } catch {
      setMsg("Kod səhvdir!");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalWindow}>
        <h4>Email təsdiqlə</h4>
        <p>{email} ünvanına göndərilən kodu daxil et:</p>
        <form onSubmit={handleVerify}>
          <input value={code} onChange={e => setCode(e.target.value)} />
          <button type="submit">Təsdiqlə</button>
        </form>
        {msg && <div>{msg}</div>}
        <button onClick={onClose}>Bağla</button>
      </div>
    </div>
  );
};
export default Modal;