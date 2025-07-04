import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { doctorRegister } from "../../redux/reducers/doctorRegisterSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import style from "./Doctor.module.css";

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
    university: "",
    specialty: "",
    password: "",
    confirmPassword: "",
    certificate: null,
    gender: ""
  });
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    // Parol validasiyası: min 8 simvol, həm hərf, həm rəqəm olmalıdır
    const pwd = form.password;
    if (pwd !== form.confirmPassword) {
      setError("Şifrələr uyğun deyil!");
      return;
    }
    if (pwd.length < 8) {
      setError("Şifrə minimum 8 simvol olmalıdır!");
      return;
    }
    if (!/[a-zA-Z]/.test(pwd) || !/[0-9]/.test(pwd)) {
      setError("Şifrə həm hərf, həm rəqəm içərməlidir!");
      return;
    }
    if (/^[0-9]+$/.test(pwd) || /^[a-zA-Z]+$/.test(pwd)) {
      setError("Şifrə yalnız hərf və ya yalnız rəqəm ola bilməz!");
      return;
    }
    if (!form.certificate) {
      setError("Sertifikat əlavə edin!");
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      await dispatch(doctorRegister(formData)).unwrap();
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
      <form
        className={style.registerForm}
        onSubmit={handleSubmit}
        autoComplete="off"
        encType="multipart/form-data"
      >
        <h2 className={style.title}>Həkim Qeydiyyatı</h2>
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
          name="university"
          type="text"
          placeholder="Universitet"
          value={form.university}
          onChange={handleChange}
          required
        />
        <select
          className={style.select}
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
          className={style.fileInput}
          name="certificate"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
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
        <button className={style.button} type="submit">Qeydiyyat</button>
        {error && <div className={style.error}>{error}</div>}
      </form>
    </div>
  );
};

export default DoctorRegister;