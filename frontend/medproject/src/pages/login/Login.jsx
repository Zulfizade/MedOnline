import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { fetchUser } from "../../redux/reducers/userSlice";
import style from "./Login.module.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    // 3 dəfə səhv parol üçün bloklama
    const failCount = Number(localStorage.getItem("loginFailCount") || 0);
    const blockUntil = Number(localStorage.getItem("loginBlockUntil") || 0);
    if (blockUntil && Date.now() < blockUntil) {
      setError("Çoxlu səhv cəhd! 5 dəqiqə sonra yenidən yoxlayın.");
      return;
    }
    try {
      const res = await dispatch(login(form)).unwrap();
      if (res && res.user) {
        localStorage.removeItem("loginFailCount");
        localStorage.removeItem("loginBlockUntil");
        await dispatch(fetchUser());
        toast.success("Giriş uğurlu!");
        navigate("/");
      } else {
        setError("Email və ya şifrə yanlışdır!");
        localStorage.setItem("loginFailCount", String(failCount + 1));
        if (failCount + 1 >= 3) {
          localStorage.setItem("loginBlockUntil", String(Date.now() + 5 * 60 * 1000));
        }
      }
    } catch (err) {
      setError(
        (typeof err === "string" && err) ||
        err?.message ||
        err?.error ||
        "Email və ya şifrə yanlışdır!"
      );
      localStorage.setItem("loginFailCount", String(failCount + 1));
      if (failCount + 1 >= 3) {
        localStorage.setItem("loginBlockUntil", String(Date.now() + 5 * 60 * 1000));
      }
    }
  };

  return (
    <div className={style.loginContainer}>
      <form className={style.loginForm} onSubmit={handleSubmit} autoComplete="off">
        <h2 className={style.title}>Giriş</h2>
        <input
          className={style.input}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className={style.input}
          name="password"
          type="password"
          placeholder="Şifrə"
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

export default Login;