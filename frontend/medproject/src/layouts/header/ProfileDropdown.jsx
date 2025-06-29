import React from "react";
import { useNavigate } from "react-router";
import styles from "./ProfileDropdown.module.css";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/reducers/userSlice";
import { logout } from "../../redux/reducers/authSlice";

const ProfileDropdown = ({ user, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(clearUser());
    onClose();
    navigate("/");
  };

  if (user) {
    return (
      <div className={styles.dropdownRoot}>
        <button className={styles.dropdownItem} onClick={() => { navigate("/profile"); onClose(); }}>
          <i className="fa fa-user"></i> Profilə bax
        </button>
        <button className={styles.dropdownItem} onClick={handleLogout}>
          <i className="fa fa-sign-out"></i> Çıxış
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dropdownRoot}>
      <button className={styles.dropdownItem} onClick={() => { navigate("/login"); onClose(); }}>
        <i className="fa fa-sign-in"></i> Daxil ol
      </button>
      <button className={styles.dropdownItem} onClick={() => { navigate("/PatientRegister"); onClose(); }}>
        <i className="fa fa-user-plus"></i> Qeydiyyat (Pasiyent)
      </button>
      <button className={styles.dropdownItem} onClick={() => { navigate("/DoctorRegister"); onClose(); }}>
        <i className="fa fa-user-md"></i> Qeydiyyat (Həkim)
      </button>
    </div>
  );
};
export default ProfileDropdown;