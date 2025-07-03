import React, { useEffect, useState } from "react";
import axios from "../../../redux/axiosInstance";
import styles from "./AdminDoctors.module.css";
import toast from "../../../utils/toast";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/admin/doctors").then(r => setDoctors(r.data)).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/admin/approve-doctor/${id}`);
      setDoctors(ds => ds.map(d => d._id === id ? { ...d, isVerified: true, rejected: false } : d));
      toast.success("Həkim təsdiqləndi!");
    } catch {
      toast.error("Təsdiqləmə uğursuz oldu!");
    }
  };
  const handleReject = async (id) => {
    try {
      await axios.patch(`/api/admin/reject-doctor/${id}`);
      setDoctors(ds => ds.map(d => d._id === id ? { ...d, isVerified: false, rejected: true } : d));
      toast.success("Həkim ləğv edildi!");
    } catch {
      toast.error("Ləğv etmək uğursuz oldu!");
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/delete-doctor/${id}`);
      setDoctors(ds => ds.filter(d => d._id !== id));
      toast.success("Həkim silindi!");
    } catch {
      toast.error("Silinmə uğursuz oldu!");
    }
  };
  return (
    <div>
      <h3>Həkimlər</h3>
      {loading ? <div>Yüklənir...</div> : (
        <table className={styles.statTable}>
          <thead>
            <tr>
              <th>Ad</th>
              <th>Email</th>
              <th>Cins</th>
              <th>Universitet</th>
              <th>Sahə</th>
              <th>Sertifikat</th>
              <th>Status</th>
              <th>Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.email}</td>
                <td>{d.gender === "male" ? "Kişi" : "Qadın"}</td>
                <td>{d.university}</td>
                <td>{d.specialty}</td>
                <td>
                  {Array.isArray(d.certificates) && d.certificates.length > 0 ? (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {d.certificates.map((cert, idx) => (
                        <div key={cert} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <img
                            src={`http://localhost:9012/uploads/certificates/${cert.replace(/^.*certificates[\\/]/, '')}`}
                            alt={`Sertifikat ${idx + 1}`}
                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, background: '#f3f3f3', marginBottom: 2, cursor: 'pointer', border: '1px solid #eee' }}
                            onClick={() => window.open(`http://localhost:9012/uploads/certificates/${cert.replace(/^.*certificates[\\/]/, '')}`, '_blank')}
                          />
                          <span style={{ fontSize: 11, color: '#888' }}>Sertifikat {idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#888' }}>Yoxdur</span>
                  )}
                </td>
                <td>
                  {d.isVerified ? (
                    <span className={`${styles.status} ${styles.approved}`}>Təsdiqlənib</span>
                  ) : d.rejected ? (
                    <span className={`${styles.status} ${styles.rejected}`}>Ləğv edilib</span>
                  ) : (
                    <span className={`${styles.status} ${styles.pending}`}>Gözləyir</span>
                  )}
                </td>
                <td>
                  <button className={styles.actionBtn} onClick={() => handleApprove(d._id)}>Qəbul et</button>
                  <button className={`${styles.actionBtn} ${styles.reject}`} onClick={() => handleReject(d._id)}>Ləğv et</button>
                  <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(d._id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDoctors;
