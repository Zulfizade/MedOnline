import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "../../redux/axiosInstance";
import style from "./DoctorDetail.module.css";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    axios.get(`/api/admin/approved-doctors`)
      .then(res => {
        const found = res.data.find(d => d._id === id);
        setDoctor(found || null);
      });
  }, [id]);

  if (!doctor) return <div className={style.notFound}>Həkim tapılmadı</div>;

  return (
    <div className={style.doctorDetail}>
      <div className={style.profileSection}>
        <img
          src={doctor.profilePhoto ? `http://localhost:9012/uploads/profile_photos/${doctor.profilePhoto}` : "/default-avatar.png"}
          alt={doctor.name}
          className={style.avatar}
        />
        <div className={style.infoSection}>
          <h2>Dr. {doctor.name}</h2>
          <div className={style.specialty}>{doctor.specialty}</div>
          <div className={style.description}>{doctor.description}</div>
          <div className={style.university}><b>Universitet:</b> {doctor.university}</div>
          <div className={style.certificates}>
            <b>Sertifikatlar:</b>
            <ul>
              {doctor.certificates && doctor.certificates.length > 0 ? (
                doctor.certificates.map((cert, idx) => (
                  <li key={idx}>
                    <a
                      href={`http://localhost:9012/uploads/${cert.replace(/\\/g, "/")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Sertifikat {idx + 1}
                    </a>
                  </li>
                ))
              ) : (
                <li>Sertifikat yoxdur</li>
              )}
            </ul>
          </div>
          <button
            className={style.chatBtn}
            onClick={() => navigate(`/chat?with=${doctor._id}&model=Doctor`)}
          >
            <i className="fa fa-comments"></i> Çata keç
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;