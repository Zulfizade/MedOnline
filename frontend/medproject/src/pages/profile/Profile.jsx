import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../redux/axiosInstance";
import { fetchUser } from "../../redux/reducers/userSlice";
import { toast } from "react-toastify";
import { Link } from "react-router";
import styles from "./Profile.module.css";
import Loader from "../../layouts/components/loader/Loader";

const Profile = () => {
  const { info: user, loading, error } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Refresh zamanı user yoxdursa və token varsa, user-i fetch et
  useEffect(() => {
    // Tokeni localStorage/cookie-dən yoxla (cookie ilə işləyir, backend withCredentials true)
    if (!user) {
      dispatch(fetchUser());
    }
    // eslint-disable-next-line
  }, []);

  // BÜTÜN HOOK-LAR BURADA OLMALIDIR!
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [newCertificate, setNewCertificate] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [description, setDescription] = useState(""); // Yeni state

  // user dəyişəndə state-ləri yenilə
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setDescription(user.description || ""); // Yeni state üçün
      setPreviewPhoto(user.profilePhoto ? `/uploads/profile_photos/${user.profilePhoto}` : "");
      setCertificates(user.certificates || []);
    }
  }, [user]);

  // Profil şəkli seç
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  // Profil şəklini sil
  const handleDeletePhoto = async () => {
    try {
      setLocalLoading(true);
      await axios.delete("/api/profile/profile-photo");
      setPreviewPhoto("");
      setProfilePhoto(null);
      toast.success("Profil şəkli silindi!");
      await dispatch(fetchUser());
    } catch {
      toast.error("Profil şəkli silinmədi!");
    } finally {
      setLocalLoading(false);
    }
  };

  // Sertifikat əlavə et
  const handleCertAdd = (e) => {
    const file = e.target.files[0];
    if (file) setNewCertificate(file);
  };

  // Sertifikat sil
  const handleCertDelete = async (filename) => {
    if (certificates[0] === filename) {
      toast.error("Qeydiyyat zamanı əlavə olunan sertifikat silinə bilməz!");
      return;
    }
    try {
      setLocalLoading(true);
      await axios.delete("/api/profile/certificate", { data: { filename } });
      setCertificates(certificates.filter(f => f !== filename));
      toast.success("Sertifikat silindi!");
      await dispatch(fetchUser());
    } catch {
      toast.error("Sertifikat silinmədi!");
    } finally {
      setLocalLoading(false);
    }
  };

  // Dəyişiklikləri təsdiqlə (handleSave)
  const handleSave = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    let changed = [];

    try {
      // Profil şəkli yüklə
      if (profilePhoto) {
        const formData = new FormData();
        formData.append("photo", profilePhoto);
        await axios.post("/api/profile/profile-photo", formData);
        changed.push("Profil şəkli");
      }

      // Sertifikat əlavə et (yalnız doctor üçün)
      if (user.role === "doctor" && newCertificate) {
        const formData = new FormData();
        formData.append("certificate", newCertificate);
        const res = await axios.post("/api/profile/certificate", formData);
        setCertificates(res.data.certificates);
        changed.push("Sertifikat");
      }

      // Ad dəyiş
      if (name !== user.name) {
        await axios.patch("/api/profile/name", { name });
        changed.push("Ad");
      }

      // Email dəyiş
      if (email !== user.email) {
        await axios.patch("/api/profile/email", { newEmail: email });
        setShowEmailModal(true);
        changed.push("Email (doğrulama tələb olunur)");
      }

      // Description dəyiş
      if (description !== user.description) {
        await axios.patch("/api/profile/description", { description });
        changed.push("Haqqında");
      }

      await dispatch(fetchUser());
      setProfilePhoto(null);
      setNewCertificate(null);

      if (changed.length > 0) {
        toast.success(`${changed.join(", ")} uğurla dəyişdirildi!`);
      } else {
        toast.info("Heç bir dəyişiklik edilmədi.");
      }
    } catch {
      toast.error("Dəyişiklik zamanı xəta baş verdi!");
    } finally {
      setLocalLoading(false);
    }
  };

  // Email kodunu təsdiqlə
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/profile/verify-email", { code: emailCode });
      toast.success("Email uğurla dəyişdirildi və təsdiqləndi!");
      setShowEmailModal(false);
      await dispatch(fetchUser());
    } catch {
      toast.error("Kod səhvdir!");
    }
  };

  // LOADING/ERROR/USER YOXLAMASI BURADA OLSUN!
  if (loading || !user) return <Loader />;
  if (error) return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <Link to="/" className={styles.homeBtn}>
          <i className="fa fa-home"></i> Ana Səhifə
        </Link>
        <h2 className={styles.profileTitle}>Profil</h2>
      </div>
      <form className={styles.profileForm} onSubmit={handleSave}>
        <div className={styles.profilePhotoSection}>
          <img
            src={user.profilePhoto ? `http://localhost:9012/uploads/profile_photos/${user.profilePhoto}` : "/default-avatar.png"}
            alt="profile"
            className={styles.profileAvatarLarge}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          {previewPhoto && (
            <button type="button" onClick={handleDeletePhoto} disabled={localLoading} className={styles.deletePhotoBtn}>
              Profil şəklini sil
            </button>
          )}
        </div>
        <label className={styles.label}>Ad:</label>
        <input value={name} onChange={e => setName(e.target.value)} className={styles.input} />

        <label className={styles.label}>Email:</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className={styles.input} />

        {user.role === "doctor" && (
          <>
            <label className={styles.label}>Haqqında (description):</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className={styles.input}
              placeholder="Qısa özünüz haqqında"
            />
          </>
        )}

        {user.role === "doctor" && (
          <div className={styles.certSection}>
            <label className={styles.label}>Sertifikat əlavə et:</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleCertAdd}
              className={styles.input}
            />
            <ul className={styles.certList}>
              {certificates.map((cert, idx) => (
                <li key={cert} className={styles.certListItem}>
                  <img
                    src={`http://localhost:9012/uploads/certificates/${cert.replace(/^.*certificates[\\/]/, '')}`}
                    alt={`Sertifikat ${idx + 1}`}
                    className={styles.certImage}
                    onClick={() => window.open(`http://localhost:9012/uploads/certificates/${cert.replace(/^.*certificates[\\/]/, '')}`, '_blank')}
                  />
                  <span className={styles.certText}>Sertifikat {idx + 1}</span>
                  {idx !== 0 && (
                    <button type="button" onClick={() => handleCertDelete(cert)} disabled={localLoading} className={styles.deleteCertBtn}>
                      Sil
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" disabled={localLoading} className={styles.saveBtn}>
          {localLoading ? "Yüklənir..." : "Dəyişiklikləri təsdiqlə"}
        </button>
      </form>

      {/* Email kodu üçün modal */}
      {showEmailModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalWindow}>
            <h4>Email təsdiqlə</h4>
            <p>Email ünvanına göndərilən kodu daxil et:</p>
            <form onSubmit={handleVerifyEmail}>
              <input value={emailCode} onChange={e => setEmailCode(e.target.value)} className={styles.input} />
              <button type="submit" className={styles.saveBtn}>Təsdiqlə</button>
            </form>
            <button onClick={() => setShowEmailModal(false)} className={styles.deletePhotoBtn}>Bağla</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;