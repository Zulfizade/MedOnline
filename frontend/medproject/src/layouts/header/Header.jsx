import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/reducers/userSlice";
import { fetchNotifications, clearNotifications } from "../../redux/reducers/notificationSlice";
import styles from "./Header.module.css";
import ProfileDropdown from "./ProfileDropdown";
import { toast } from "react-toastify";

const specialties = [
  "Kardioloq", "Nevroloq", "Cərrah", "Pediatr", "Dermatoloq", "Oftalmoloq",
  "Stomatoloq", "Psixiatr", "Endokrinoloq", "Onkoloq", "Ortoped", "Digər"
];

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.info);
  const notifications = useSelector(state => state.notifications.items);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    } else {
      dispatch(clearNotifications());
    }
  }, [user, dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowUserMenu(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearch(false);
      if (categoryRef.current && !categoryRef.current.contains(event.target)) setShowCategory(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchIconClick = () => setShowSearch(v => !v);
  const handleUserIconClick = () => setShowUserMenu(v => !v);
  const handleNotificationClick = () => setShowNotifications(v => !v);
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setShowSearch(false);
    }
  };
  const handleNotificationItemClick = async (msg) => {
    const receiverId = typeof msg.receiver === "object" ? msg.receiver._id : msg.receiver;
    if (!receiverId || receiverId !== user._id) {
      toast.error("Bu bildirişi oxundu kimi işarələyə bilməzsiniz.");
      return;
    }
    try {
      await fetch(`/api/chat/read/${msg._id}`, { method: "PATCH", credentials: "include" });
      await dispatch(fetchNotifications());
    } catch (e) {
      console.error(e);
    }
    navigate(`/chat?with=${msg.sender?._id}`);
    setShowNotifications(false);
  };

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <a href="/" className={styles.logoLink}>
          <span className={styles.logoMed}>Med</span><span className={styles.logoOnline}>Online</span>
        </a>
      </div>
      <ul className={styles.navLinks}>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li
          ref={categoryRef}
          style={{ position: "relative" }}
          onMouseEnter={() => setShowCategory(true)}
          onMouseLeave={() => setShowCategory(false)}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            Category <i className="fa fa-chevron-down" style={{ fontSize: 12 }}></i>
          </span>
          {showCategory && (
            <div className={styles.categoryDropdown}>
              {specialties.map(s => (
                <a key={s} href="#" className={styles.categoryDropdownItem}>
                  {s}
                </a>
              ))}
            </div>
          )}
        </li>
        <li><a href="/tips">Tips</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div className={styles.icons}>
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
        {user && (
          <div ref={notificationRef} style={{ position: "relative" }}>
            <i className='fa-solid fa-bell' onClick={handleNotificationClick}>
              {Array.isArray(notifications) && notifications.length > 0 && (
                <span className={styles.notificationBadge}>
                  {notifications.length}
                </span>
              )}
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
                      <strong>{msg.sender?.name || "Unknown"}</strong> tərəfindən mesajınız var
                    </div>
                  ))
                ) : (
                  <div className={styles.dropdownItem}>Empty</div>
                )}
              </div>
            )}
          </div>
        )}
        <div ref={userMenuRef} style={{ position: "relative" }}>
          {user?.profilePhoto ? (
            <img
              src={user?.profilePhoto ? `http://localhost:9012/uploads/profile_photos/${user.profilePhoto}` : "/default-avatar.png"}
              alt="profile"
              className={styles.profileAvatar}
              onClick={handleUserIconClick}
              style={{width: 30, height: 30, borderRadius: "50%", cursor: "pointer", objectFit: "cover"}}
            />
          ) : (
            <i className='fa fa-user' onClick={handleUserIconClick}></i>
          )}
          {showUserMenu && (
            <div className={styles.dropdowns}>
              <ProfileDropdown user={user} onClose={() => setShowUserMenu(false)} />
            </div>
          )}
        </div>
      </div>
      <button className={styles.bars} onClick={() => setMobileMenuOpen(true)}>
        <i className="fa fa-bars"></i>
      </button>
      {mobileMenuOpen && (
        <>
          <div className={styles.mobileMenuOverlay} onClick={() => setMobileMenuOpen(false)} />
          <nav className={`${styles.mobileMenu} ${styles.mobileMenuOpen}`}>
            <button className={styles.mobileMenuCloseBtn} onClick={() => setMobileMenuOpen(false)}>
              <i className="fa fa-times"></i>
            </button>
            <div className={styles.mobileMenuLinks}>
              <a href="/">Home</a>
              <a href="/about">About</a>
              <button onClick={() => setMobileCategoryOpen(v => !v)}>
                Category <i className="fa fa-chevron-down"></i>
              </button>
              {mobileCategoryOpen && (
                <div className={styles.mobileCategoryDropdown}>
                  {specialties.map(s => (
                    <a key={s} href="#" className={styles.mobileCategoryDropdownItem}>{s}</a>
                  ))}
                </div>
              )}
              <a href="/tips">Tips</a>
              <a href="/contact">Contact</a>
              {user ? (
                <>
                  <a href="/profile">Profil</a>
                  <button onClick={() => {
                    window.location.href = "/logout";
                  }}>Çıxış</button>
                </>
              ) : (
                <>
                  <a href="/login">Daxil ol</a>
                  <a href="/PatientRegister">Qeydiyyat (Pasiyent)</a>
                  <a href="/DoctorRegister">Qeydiyyat (Həkim)</a>
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </div>
  );
};

export default Header;