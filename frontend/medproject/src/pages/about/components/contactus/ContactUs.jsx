import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import axios from "../../../../redux/axiosInstance";
import styles from "./ContactUs.module.css";
import { toast } from "react-toastify";

const initialState = {
  name: "",
  email: "",
  number: "",
  subject: "",
  message: "",
};

const ContactUs = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Send to backend
      await axios.post("/api/contact", form);
      // 2. Send via emailjs
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form,
        import.meta.env.VITE_EMAILJS_USER_ID
      );
      toast.success("Mesajınız göndərildi!");
      setForm(initialState);
    } catch {
      toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactUsContainer}>
      <h2>Have a Question? Contact Us Today!</h2>
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <input
          type="text"
          name="name"
          placeholder="Ad Soyad"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="number"
          placeholder="Telefon"
          value={form.number}
          onChange={handleChange}
        />
        <input
          type="text"
          name="subject"
          placeholder="Mövzu"
          value={form.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Mesajınız"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Göndərilir..." : "Göndər"}
        </button>

      </form>
    </div>
  );
};

export default ContactUs;
