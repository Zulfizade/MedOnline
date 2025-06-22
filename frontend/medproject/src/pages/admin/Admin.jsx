import React, { useEffect, useState } from "react";
import axios from "../../redux/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

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
    if (doc.isVerified) return { text: "Təsdiqlənib", color: "#2ecc40" };
    if (doc.rejected) return { text: "Ləğv olunub", color: "#ff4136" };
    return { text: "Pending", color: "#ffdc00" };
  };

  return (
    <div style={{padding: "2rem"}}>
      <h2>Admin Panel</h2>
      <div style={{marginBottom: "1rem"}}>
        <button onClick={() => setTab("doctors")}>Doktorlar</button>
        <button onClick={() => setTab("patients")}>Patientlər</button>
      </div>
      {tab === "doctors" && (
        doctors.length === 0 ? (
          <div>Heç bir doktor tapılmadı.</div>
        ) : (
        <table border={1} cellPadding={8} cellSpacing={0}>
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
                      href={`http://localhost:9012/${doc.certificate.replace(/\\/g, "/")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Bax
                    </a>
                  </td>
                  <td>
                    <span style={{
                      background: status.color,
                      color: "#222",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontWeight: "bold"
                    }}>
                      {status.text}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleApprove(doc._id)}>Təsdiqlə</button>
                    <button onClick={() => handleReject(doc._id)}>Ləğv et</button>
                    <button onClick={() => handleDeleteDoctor(doc._id)}>Sil</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )
      )}
      {tab === "patients" && (
        patients.length === 0 ? (
          <div>Heç bir patient tapılmadı.</div>
        ) : (
        <table border={1} cellPadding={8} cellSpacing={0}>
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
                  <button onClick={() => handleDeletePatient(pat._id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )
      )}
    </div>
  );
}

export default Admin;