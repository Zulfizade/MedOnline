import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, clearUser } from "../../redux/reducers/userSlice";
import { fetchNotifications, clearNotifications } from "../../redux/reducers/notificationSlice";
import { logout } from "../../redux/reducers/authSlice";
import styles from "./Header.module.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.info);
  const notifications = useSelector(state => state.notifications.items);
  const notificationCount = user && Array.isArray(notifications) ? notifications.length : 0;

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  // İlk renderdə user məlumatını çək
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // User dəyişəndə bildirişləri çək və ya təmizlə
  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    } else {
      dispatch(clearNotifications());
    }
  }, [user, dispatch]);

  // Dropdown-ları çöldən klikləyəndə bağla
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowUserMenu(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearch(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search iconuna basanda dropdown aç
  const handleSearchIconClick = () => setShowSearch(v => !v);

  // User iconuna basanda dropdown aç
  const handleUserIconClick = () => setShowUserMenu(v => !v);

  // Bell iconuna basanda dropdown aç
  const handleNotificationClick = () => setShowNotifications(v => !v);

  // Search input submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setShowSearch(false);
    }
  };

  // User menu click
  const handleSignIn = () => {
    navigate('/login');
    setShowUserMenu(false);
  };
  const handleSignUpPatient = () => {
    navigate('/PatientRegister');
    setShowUserMenu(false);
  };
  const handleSignUpDoctor = () => {
    navigate('/DoctorRegister');
    setShowUserMenu(false);
  };
  const handleProfile = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };
  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(clearUser());
    setShowUserMenu(false);
    navigate('/');
  };

  // Bildirişə klik
  const handleNotificationItemClick = (msg) => {
    navigate(`/chat?with=${msg.sender?._id}`);
    setShowNotifications(false);
  };

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <a href="/"> <img src="" alt="Logo" width="50px" height="50px" /> </a>
      </div>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/category">Category</a></li>
        <li><a href="/tips">Tips</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div className={styles.icons}>
        {/* Search Icon & Dropdown */}
        <div ref={searchRef} style={{ position: "relative" }}>
          <i className='fa fa-search' onClick={handleSearchIconClick}></i>
          {showSearch && (
            <div className={styles.dropdown} style={{ right: 0, minWidth: 220 }}>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={search}
                  placeholder="Search..."
                  className={styles.searchDropdownInput}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                />
              </form>
              {search && (
                <div className={styles.dropdownItem}>
                  {search}
                </div>
              )}
            </div>
          )}
        </div>
        {/* User Icon & Dropdown */}
        <div ref={userMenuRef} style={{ position: "relative" }}>
          <i className='fa fa-user' onClick={handleUserIconClick}></i>
          {showUserMenu && (
            <div className={styles.dropdown} style={{ right: 0, minWidth: 180 }}>
              {!user ? (
                <>
                  <button className={styles.dropdownBtn} onClick={handleSignIn}>Sign In</button>
                  <button className={styles.dropdownBtn} onClick={handleSignUpPatient}>Sign Up Patient</button>
                  <button className={styles.dropdownBtn} onClick={handleSignUpDoctor}>Sign Up Doctor</button>
                </>
              ) : (
                <>
                  <button className={styles.dropdownBtn} onClick={handleProfile}>Profile</button>
                  <button className={styles.dropdownBtn} onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>
          )}
        </div>
        {/* Bell Icon & Dropdown */}
        {user && (
          <div ref={notificationRef} style={{ position: "relative" }}>
            <i className='fa-solid fa-bell' onClick={handleNotificationClick}>
              <span className={styles.notificationBadge}>
                {notificationCount}
              </span>
            </i>
            {showNotifications && (
              <div className={styles.dropdown} style={{ right: 0, minWidth: 220, maxHeight: 300, overflowY: "auto" }}>
                {Array.isArray(notifications) && notifications.length > 0 ? (
                  notifications.map((msg) => (
                    <div
                      key={msg._id}
                      className={styles.dropdownItem}
                      onClick={() => handleNotificationItemClick(msg)}
                      tabIndex={0}
                      role="button"
                    >
                      <strong>{msg.sender?.name || "Unknown"}</strong>: {msg.message}
                    </div>
                  ))
                ) : (
                  <div className={styles.dropdownItem}>Empty</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <i className={`fa-solid fa-bars ${styles.bars}`}></i>
    </div>
  );
};

export default Header;