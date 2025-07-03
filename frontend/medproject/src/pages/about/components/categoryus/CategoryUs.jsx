import React from 'react'
import style from './CategoryUs.module.css'
import { Link } from 'react-router'

function CategoryUs() {
    return (
        <div className={style.categoryUs}>
            <div className={style.mainSection}>
                <div className={style.leftOverlay}>
                    <h2>Category Us</h2>
                    <p>On MedOnline, our Categories page is designed to help you easily navigate and find the right medical specialist for your needs. Whether you're looking for a cardiologist, dermatologist, psychologist, or any other healthcare professional, our category system simplifies your search and connects you directly to the most relevant experts</p>
                    <Link to="/category"><button> Go to Category Page</button></Link>
                </div>
                <div className={style.rightOverlay}>
                    <ul className={style.categoryUsList}>
                        <li>✅ + 10 Doctor Categories</li>
                        <li>✅ + 100 Doctors</li>
                        <li>✅ + 10 000 Patients</li>
                        <li>✅ + 1 000 Successful Consultations</li>
                        <li>✅ + 5 000 Happy Patients</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default CategoryUs