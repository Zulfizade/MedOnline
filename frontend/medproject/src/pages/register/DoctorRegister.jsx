import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { doctorRegister } from "../../redux/reducers/doctorRegisterSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const specialties = [
  "Kardioloq",
  "Nevroloq",
  "Cərrah",
  "Pediatr",
  "Dermatoloq",
  "Oftalmoloq",
  "Stomatoloq",
  "Psixiatr",
  "Endokrinoloq",
  "Onkoloq",
  "Ortoped",
  "Digər"
];

const DoctorRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    specialty: "",
    certificate: null
  });
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "certificate") {
      setForm({ ...form, certificate: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    if (!form.certificate) {
      setError("Sertifikat yüklənməlidir!");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const res = await dispatch(doctorRegister(formData)).unwrap();
      if (res && res.doctor) {
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
      <h2>Doctor Register</h2>
      <form onSubmit={handleSubmit} autoComplete="off" encType="multipart/form-data">
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
          name="university"
          placeholder="University"
          value={form.university}
          onChange={handleChange}
          required
        />
        <select
          name="specialty"
          value={form.specialty}
          onChange={handleChange}
          required
        >
          <option value="">Sahə seçin</option>
          {specialties.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          name="certificate"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
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

export default DoctorRegister;