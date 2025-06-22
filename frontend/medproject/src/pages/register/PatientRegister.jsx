import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { patientRegister } from "../../redux/reducers/patientRegisterSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const PatientRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await dispatch(patientRegister(form)).unwrap();
      if (res && res.patient) {
        toast.info("Qeydiyyat uğurla başa çatdı. Qısa müddətdə admin təsdiqləyəcək.");
        navigate("/login");
      } else {
        setError("Qeydiyyat zamanı xəta baş verdi!");
      }
    } catch (err) {
      setError(
        err?.message ||
        err?.error ||
        "Qeydiyyat zamanı xəta baş verdi!"
      );
    }
  };

  return (
    <div>
      <h2>Patient Register</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <div style={{color:"red"}}>{error}</div>}
    </div>
  );
};

export default PatientRegister;