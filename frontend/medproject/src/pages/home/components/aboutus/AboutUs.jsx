import React from 'react'
import style from './AboutUs.module.css'
import { Link } from 'react-router'

function AboutUs() {
    return (
        <div className={style.aboutUs}>
            <div className={style.image}>
                <div className={style.overlayLeft}>
                    <span>About Us</span>
                    <h3>With MedOnline, your doctor is just a breath away.</h3>
                    <p>
                        MedOnline was created to make medical support faster and more accessible for everyone.
                        By combining professional doctors with modern technology, we bring healthcare just a tap away.
                        Our mission is to build a reliable, fast, and accessible medical platform for all.
                    </p>
                    <Link to="/about">
                        <i className="fa fa-arrow-right" aria-hidden="true"></i> Read More
                    </Link>
                </div>
                <div className={style.overlayRight}>
                    <h3>We Take Pride In Our Impact</h3>
                    <ul>
                        <li>✅ 100+ certified and experienced doctors</li>
                        <li>✅ 95% user satisfaction rate</li>
                        <li>✅ 5+ Years Of Continuous Service and Innovation</li>
                        <li>✅ 10,000+ Successful Consultations</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AboutUs