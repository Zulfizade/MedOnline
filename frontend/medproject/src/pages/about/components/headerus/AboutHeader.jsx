import React from 'react'
import style from './AboutHeader.module.css'
import { Link } from 'react-router'

function AboutHeader() {
    return (
        <div className={style.aboutHeader}>
            <div className={style.headerImage}>
                <img src="https://images01.nicepage.com/61/58/6158b984e0fd04ce18f390ab2b6eab25.png" alt="" />
            </div>
            <div className={style.headerContent}>
                <h1 className={style.headerTitle}>We're Always Ready To Help</h1>
                <p className={style.headerDescription}>MedOnline is a platform that puts your health first by connecting you quickly and easily with qualified medical professionals. Here, you can book appointments, ask questions, and get expert medical advice. MedOnline is here to make your life easier and healthier. Your trusted destination for a healthier future!</p>
                <Link to="/contact"><button className={style.headerBtn}>Contact Us</button></Link>
            </div>
        </div>
    )
}

export default AboutHeader