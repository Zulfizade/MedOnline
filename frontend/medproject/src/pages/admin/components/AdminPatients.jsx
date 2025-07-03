import React, { useEffect, useState } from "react";
import axios from "../../../redux/axiosInstance";
import styles from "./AdminPatients.module.css";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/admin/patients").then(r => setPatients(r.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/delete-patient/${id}`);
    setPatients(ps => ps.filter(p => p._id !== id));
  };
  return (
    <div>
      <h3>Pasiyentlər</h3>
      {loading ? <div>Yüklənir...</div> : (
        <table className={styles.statTable}>
          <thead>
            <tr>
              <th>Ad</th>
              <th>Email</th>
              <th>Cins</th>
              <th>Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.gender === "male" ? "Kişi" : "Qadın"}</td>
                <td>
                  <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(p._id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPatients;
