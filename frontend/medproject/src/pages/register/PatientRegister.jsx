import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { patientRegister } from "../../redux/reducers/patientRegisterSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import style from "./Patient.module.css";

const PatientRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: ""
  });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError("Şifrələr uyğun deyil!");
      return;
    }
    try {
      await dispatch(patientRegister(form)).unwrap();
      toast.success("Qeydiyyat uğurlu!");
      navigate("/login");
    } catch (err) {
      setError(
        (typeof err === "string" && err) ||
        err?.message ||
        err?.error ||
        "Qeydiyyat zamanı xəta baş verdi!"
      );
    }
  };

  return (
    <div className={style.registerContainer}>
      <form className={style.registerForm} onSubmit={handleSubmit} autoComplete="off">
        <h2 className={style.title}>Pasiyent Qeydiyyatı</h2>
        <input
          className={style.input}
          name="name"
          type="text"
          placeholder="Ad"
          value={form.name}
          onChange={handleChange}
          required
        />
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
        <input
          className={style.input}
          name="confirmPassword"
          type="password"
          placeholder="Şifrə təkrar"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <div className={style.genderBlock}>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={handleChange}
              required
            /> Kişi
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={handleChange}
              required
            /> Qadın
          </label>
        </div>
        <button className={style.button} type="submit">Qeydiyyat</button>
        {error && <div className={style.error}>{error}</div>}
      </form>
    </div>
  );
};

export default PatientRegister;