import React, { useState } from "react";
import AdminDoctors from "./AdminDoctors";
import AdminPatients from "./AdminPatients";
import styles from "./AdminUsers.module.css";

const AdminUsers = () => {
  const [tab, setTab] = useState("patients");
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={tab === "patients" ? `${styles.tabButton} ${styles.active}` : styles.tabButton}
          onClick={() => setTab("patients")}
        >
          Pasiyentlər
        </button>
        <button
          className={tab === "doctors" ? `${styles.tabButton} ${styles.active}` : styles.tabButton}
          onClick={() => setTab("doctors")}
        >
          Həkimlər
        </button>
      </div>
      <div className={styles.tabContent}>
        {tab === "patients" ? <AdminPatients /> : <AdminDoctors />}
      </div>
    </div>
  );
};

export default AdminUsers;
