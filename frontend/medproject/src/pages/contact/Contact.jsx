
import React, { useState } from "react";
import ContactUs from "../about/components/contactus/ContactUs";
import style from "./Contact.module.css";

const contactInfoData = [
  {
    question: "Doctorla elaqe yaratmaqda çətinlik çəkirsən?",
    answer: "Əgər çətinlik yaşayırsınızsa, dəstək komandamızla əlaqə saxlayın və ya chat bölməsindən istifadə edin."
  },
  {
    question: "Doctorla elaqe yaratmaqda çətinlik çəkirsən?",
    answer: "Əgər çətinlik yaşayırsınızsa, dəstək komandamızla əlaqə saxlayın və ya chat bölməsindən istifadə edin."
  },
  {
    question: "Doctorla elaqe yaratmaqda çətinlik çəkirsən?",
    answer: "Əgər çətinlik yaşayırsınızsa, dəstək komandamızla əlaqə saxlayın və ya chat bölməsindən istifadə edin."
  },
  {
    question: "Doctorla elaqe yaratmaqda çətinlik çəkirsən?",
    answer: "Əgər çətinlik yaşayırsınızsa, dəstək komandamızla əlaqə saxlayın və ya chat bölməsindən istifadə edin."
  },
  {
    question: "Doctorla elaqe yaratmaqda çətinlik çəkirsən?",
    answer: "Əgər çətinlik yaşayırsınızsa, dəstək komandamızla əlaqə saxlayın və ya chat bölməsindən istifadə edin."
  },
];

function Contact() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className={style.contact}>
      <img src="https://images01.nicepage.com/c461c07a441a5d220e8feb1a/17ce6b1b08f35e7cb5509161/ffdf-min.jpg" alt="" />
      <div className={style.contactForm}><ContactUs/></div>

      <div className={style.contactInfo}>
        <ul className={style.contactInfoList}>
          {contactInfoData.map((item, idx) => (
            <li
              key={idx}
              onMouseEnter={() => setOpenIndex(idx)}
              onMouseLeave={() => setOpenIndex(null)}
              style={{ position: "relative", cursor: "pointer" }}
            >
              {item.question}
              {openIndex === idx && (
                <div className={style.answer}>
                  {item.answer}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Contact;