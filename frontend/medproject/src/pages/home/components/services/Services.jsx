import React from 'react'
import style from './Services.module.css'

function Services() {
  return (
    <div className={style.services}>
      <div className={style.service}>
        <i className={`fa-brands fa-rocketchat ${style.icon} ${style.red}`}></i>
        <h3 className={style.serviceTitle}>Online Consultation</h3>
        <p className={style.serviceDescription}>Send your medical questions directly to professional doctors and receive quick answers.</p>
      </div>
      <div className={style.service}>
        <i className={`fa-solid fa-file-medical ${style.icon} ${style.orange}`}></i>
        <h3 className={style.serviceTitle}>E-Prescription</h3>
        <p className={style.serviceDescription}>Doctor-approved prescriptions are sent directly to your account.</p>
      </div>
      <div className={style.service}>
        <i className={`fa-solid fa-headset ${style.icon} ${style.green}`}></i>
        <h3 className={style.serviceTitle}>7/24 Support</h3>
        <p className={style.serviceDescription}>Get help and ask questions anytime, day or night.</p>
      </div>
      <div className={style.service}>
        <i className={`fa-solid fa-lock ${style.icon} ${style.blue}`}></i>
        <h3 className={style.serviceTitle}>Secure Data Protection</h3>
        <p className={style.serviceDescription}>Your data is protected with the highest security standards.</p>
      </div>
    </div>
  )
}

export default Services