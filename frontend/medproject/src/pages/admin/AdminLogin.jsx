import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { fetchUser } from "../../redux/reducers/userSlice";
import style from "./AdminLogin.module.css";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await dispatch(login(form)).unwrap();
      if (res && res.user && res.user.role === "admin") {
        await dispatch(fetchUser());
        toast.success("Admin girişi uğurlu!");
        navigate("/dashboard");
      } else {
        setError("Yalnız admin girişi mümkündür!");
      }
    } catch (err) {
      setError(
        (typeof err === "string" && err) ||
        err?.message ||
        err?.error ||
        "Email və ya şifrə yanlışdır!"
      );
    }
  };

  return (
    <div className={style.adminLoginContainer}>
      <form className={style.adminLoginForm} onSubmit={handleSubmit} autoComplete="off">
        <h2 className={style.title}>Admin Panel Girişi</h2>
        <input
          className={style.input}
          name="email"
          type="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className={style.input}
          name="password"
          type="password"
          placeholder="Admin Şifrə"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className={style.button} type="submit">Giriş</button>
        {error && <div className={style.error}>{error}</div>}
      </form>
    </div>
  );
};

export default AdminLogin;