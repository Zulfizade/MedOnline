import React, { useEffect, useState } from "react";
import axios from "../../redux/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import style from "./Admin.module.css";

function Admin() {
  const user = useSelector(state => state.user.info);
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [tab, setTab] = useState("doctors");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin-login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      axios.get("/api/admin/pending-doctors").then(res => setDoctors(res.data));
      axios.get("/api/admin/patients").then(res => setPatients(res.data));
    }
  }, [user]);

  const handleApprove = async (id) => {
    await axios.patch(`/api/admin/approve-doctor/${id}`);
    toast.success("Təsdiqləndi!");
    setDoctors(doctors =>
      doctors.map(d =>
        d._id === id ? { ...d, isVerified: true, rejected: false } : d
      )
    );
  };

  const handleReject = async (id) => {
    await axios.patch(`/api/admin/reject-doctor/${id}`);
    toast.info("Ləğv olundu!");
    setDoctors(doctors =>
      doctors.map(d =>
        d._id === id ? { ...d, isVerified: false, rejected: true } : d
      )
    );
  };

  const handleDeleteDoctor = async (id) => {
    await axios.delete(`/api/admin/delete-doctor/${id}`);
    toast.error("Silindi!");
    setDoctors(doctors => doctors.filter(d => d._id !== id));
  };

  const handleDeletePatient = async (id) => {
    await axios.delete(`/api/admin/delete-patient/${id}`);
    toast.error("Silindi!");
    setPatients(patients => patients.filter(p => p._id !== id));
  };

  // Status rəngi
  const getStatus = (doc) => {
    if (doc.isVerified) return { text: "Təsdiqlənib", color: "#1a8f3c" };
    if (doc.rejected) return { text: "Ləğv olunub", color: "#ff4136" };
    return { text: "Pending", color: "#ffdc00" };
  };

  return (
    <div className={style.adminPanelContainer}>
      <h2 className={style.title}>Admin Panel</h2>
      <div className={style.tabButtons}>
        <button
          className={`${style.tabBtn} ${tab === "doctors" ? style.active : ""}`}
          onClick={() => setTab("doctors")}
        >
          Doktorlar
        </button>
        <button
          className={`${style.tabBtn} ${tab === "patients" ? style.active : ""}`}
          onClick={() => setTab("patients")}
        >
          Patientlər
        </button>
      </div>
      {tab === "doctors" && (
        doctors.length === 0 ? (
          <div className={style.emptyMsg}>Heç bir doktor tapılmadı.</div>
        ) : (
        <div className={style.tableWrapper}>
          <table className={style.table}>
            <thead>
              <tr>
                <th>Ad</th>
                <th>Email</th>
                <th>Universitet</th>
                <th>Sahə</th>
                <th>Sertifikat</th>
                <th>Status</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doc => {
                const status = getStatus(doc);
                return (
                  <tr key={doc._id}>
                    <td>{doc.name}</td>
                    <td>{doc.email}</td>
                    <td>{doc.university}</td>
                    <td>{doc.specialty}</td>
                    <td>
                      <a
                        className={style.certificateLink}
                        href={`http://localhost:9012/${doc.certificate.replace(/\\/g, "/")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Bax
                      </a>
                    </td>
                    <td>
                      <span
                        className={style.statusBadge}
                        style={{ background: status.color }}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td>
                      <button className={style.actionBtn} onClick={() => handleApprove(doc._id)}>Təsdiqlə</button>
                      <button className={style.actionBtn} onClick={() => handleReject(doc._id)}>Ləğv et</button>
                      <button className={style.deleteBtn} onClick={() => handleDeleteDoctor(doc._id)}>Sil</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )
      )}
      {tab === "patients" && (
        patients.length === 0 ? (
          <div className={style.emptyMsg}>Heç bir patient tapılmadı.</div>
        ) : (
        <div className={style.tableWrapper}>
          <table className={style.table}>
            <thead>
              <tr>
                <th>Ad</th>
                <th>Email</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(pat => (
                <tr key={pat._id}>
                  <td>{pat.name}</td>
                  <td>{pat.email}</td>
                  <td>
                    <button className={style.deleteBtn} onClick={() => handleDeletePatient(pat._id)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )
      )}
    </div>
  );
}

export default Admin;