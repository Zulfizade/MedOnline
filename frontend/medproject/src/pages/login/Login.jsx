import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/reducers/authSlice";
import { fetchUser } from "../../redux/reducers/userSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const status = useSelector(state => state.auth.status);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await dispatch(login(form)).unwrap();
      if (res && res.user) {
        await dispatch(fetchUser());
        navigate("/");
      } else {
        setError("Email və ya şifrə yanlışdır!");
      }
    } catch (err) {
      // Pending doctor üçün xüsusi toast
      if (
        (typeof err === "string" && err.includes("admin tərəfindən təsdiqlənməyib")) ||
        (err?.message && err.message.includes("admin tərəfindən təsdiqlənməyib"))
      ) {
        toast.info("Hesabınız admin tərəfindən təsdiqlənməyib. Qısa müddətdə baxılacaq.");
      } else if (
        (typeof err === "string" && err.includes("Kullanıcı bulunamadı")) ||
        (err?.message && err.message.includes("Kullanıcı bulunamadı"))
      ) {
        setError("Belə bir istifadəçi tapılmadı!");
      } else if (
        (typeof err === "string" && err.includes("Şifre yanlış")) ||
        (err?.message && err.message.includes("Şifre yanlış"))
      ) {
        setError("Şifrə yanlışdır!");
      } else {
        setError(
          (typeof err === "string" && err) ||
          err?.message ||
          err?.error ||
          "Email və ya şifrə yanlışdır!"
        );
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={status === "loading"}>Login</button>
      </form>
      {error && <div style={{color:"red"}}>{error}</div>}
    </div>
  );
};

export default Login;