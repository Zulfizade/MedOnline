import React, { useState, useEffect } from 'react';
import style from './ServicesUs.module.css';


const AnimatedNumber = ({ targetNumber, duration }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let current = 0;
        const intervalTime = 20; // 20ms-də bir yenilənmə
        const totalSteps = duration * 500 / intervalTime;
        const increment = targetNumber / totalSteps;

        const interval = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                setCount(targetNumber);
                clearInterval(interval);
            } else {
                setCount(Math.floor(current)); // tam ədədlə göstər
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, [targetNumber, duration]);

    return (
        <p style={{ fontSize: "1.2rem", fontFamily: "Arial, sans-serif", color: "#fff" }}>
            + {count}
        </p>
    );
};

const ServicesUs = () => {
    return (
        <div className={style.servicesUs}>
            <ul className={style.servicesUsList}>
                <li>
                    <i className="fa-solid fa-handshake"></i>
                    <div className={style.servicesUsItem}>
                        <h3>Consultations</h3>
                        <AnimatedNumber targetNumber={10000} duration={5} />
                    </div>
                </li>

                <li>
                    <i className="fa-solid fa-stethoscope"></i>
                    <div className={style.servicesUsItem}>
                        <h3>Doctors</h3>
                        <AnimatedNumber targetNumber={500} duration={5} />
                    </div>
                </li>

                <li>
                    <i className="fa-solid fa-users"></i>
                    <div className={style.servicesUsItem}>
                        <h3>Patients</h3>
                        <AnimatedNumber targetNumber={2000} duration={5} />
                    </div>
                </li>

                <li>
                    <i className="fa-solid fa-hospital"></i>
                    <div className={style.servicesUsItem}>
                        <h3>Hospitals</h3>
                        <AnimatedNumber targetNumber={50} duration={5} />
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default ServicesUs;
