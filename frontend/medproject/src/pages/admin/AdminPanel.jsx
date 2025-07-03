import React, { useState } from "react";
import AdminStatistic from "./components/AdminStatistic";
import AdminUsers from "./components/AdminUsers";
import AdminTips from "./components/AdminTips";
import AdminContactMessages from "./components/AdminContactMessages";
import styles from "./AdminPanel.module.css";
// public qovluğundakı şəkillər üçün birbaşa "/logo.png" istifadə edin
const logo = "/logo.png";

const SECTIONS = [
  { key: "statistic", label: "Statistika" },
  { key: "users", label: "İstifadəçilər" },
  { key: "tips", label: "Tips" },
  { key: "messages", label: "Mesajlar" },
];

const AdminPanel = () => {
  const [section, setSection] = useState("statistic");

  return (
    <div className={styles.adminPanelWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logoBlock} onClick={() => window.location.href = "/"} style={{cursor:'pointer'}}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>
        <nav className={styles.nav}>
          {SECTIONS.map(s => (
            <button
              key={s.key}
              className={section === s.key ? styles.active : ""}
              onClick={() => setSection(s.key)}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className={styles.content}>
        {section === "statistic" && <AdminStatistic />}
        {section === "users" && <AdminUsers />}
        {section === "tips" && <AdminTips />}
        {section === "messages" && <AdminContactMessages />}
      </main>
    </div>
  );
};

export default AdminPanel;
