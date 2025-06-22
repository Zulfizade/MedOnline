import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { fetchUser } from "../../redux/reducers/userSlice";

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
    <div>
      <h2>Admin Panel Girişi</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          name="email"
          type="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Admin Şifrə"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Giriş</button>
      </form>
      {error && <div style={{color:"red"}}>{error}</div>}
    </div>
  );
};

export default AdminLogin;