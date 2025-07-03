import React from 'react'
import style from './TipsUs.module.css'
import { Link } from 'react-router';

function TipsUs() {
  return (
    <div className={style.tipsUs}>
        <div className={style.tipsUsImage}>
            <img src="https://www.alegriamed.com/wp-content/uploads/2023/12/Take-care-of-your-health-in-winter.jpg" alt="" />
        </div>
        <div className={style.tipsUsContent}>
            <h1>Tips for Better Health</h1>
            <p>Learn how to support your health naturally with simple and effective tips. Here you’ll find home-based suggestions for various common conditions. Please note: these tips are not a substitute for professional medical advice. Always consult a doctor if symptoms persist.</p>
            <Link to="/tips"><button>Go to Tips Page</button></Link>
        </div>
    </div>
  )
}

export default TipsUs