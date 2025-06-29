import React, { useEffect, useState } from "react";
import axios from "../../../../redux/axiosInstance";
import styles from "./DoctorList.module.css";
import { useNavigate } from "react-router";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/admin/approved-doctors")
      .then(res => setDoctors(res.data))
      .catch(() => setDoctors([]));
  }, []);

  return (
    <section className={styles.doctorListSection}>
      <h2 className={styles.title}>Step Heal with Heart</h2>
      <div className={styles.doctorGrid}>
        {doctors.map(doc => (
          <div
            className={styles.doctorCard}
            key={doc._id}
            onClick={() => navigate(`/doctor/${doc._id}`)}
            style={{ cursor: "pointer" }}
            tabIndex={0}
            role="button"
          >
            <div className={styles.doctorProfile}>
              <img
                src={doc.profilePhoto ? `http://localhost:9012/uploads/profile_photos/${doc.profilePhoto}` : "/default-avatar.png"}
                alt={doc.name}
                className={styles.avatar}
              />
            </div>
            <div className={styles.docName}>Dr.{doc.name}</div>
            <div className={styles.docSpecialty}>{doc.specialty}</div>
            <div className={styles.docDescription}>
              {doc.description && doc.description.length > 70
                ? doc.description.slice(0, 70) + "..."
                : doc.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DoctorList;