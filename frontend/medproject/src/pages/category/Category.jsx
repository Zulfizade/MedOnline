import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "../../redux/axiosInstance";
import styles from "./Category.module.css";
import Loader from "../../layouts/components/loader/Loader";

const Category = () => {
  const { speciality } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/doctors?speciality=${speciality}`)
      .then(res => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [speciality]);

  if (loading) return <Loader />;

  if (!doctors.length) {
    return <div className={styles.notFound}>Bu sahədə çalışan həkimimiz yoxdur.</div>;
  }



return (
  <div className={styles.category}>
    <img src="https://html.themehealer.com/careon/assets/images/backgrounds/page-header-bg.jpg" alt="" />
    <div className={styles.categoryCard}>
      {doctors.map(doc => (
        <div className={styles.card} key={doc._id}>
          <div
            className={styles.imgWrap}
            style={{
              backgroundImage: `url(http://localhost:9012/uploads/profile_photos/${doc.profilePhoto})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <button
              className={styles.chatIconBtn}
              title="Chat"
              onClick={() => window.location.href = `/chat?doctor=${doc._id}`}
            >
              <i className="fa fa-comment"></i>
            </button>
          </div>
          <div className={styles.name}>Dr.{doc.name}</div>
          <div className={styles.spec}>{doc.specialty}</div>
        </div>
      ))}
    </div>
  </div>
);
};

export default Category;