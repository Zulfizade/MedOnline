import React from 'react'
import style from './Footer.module.css'
import { Link } from 'react-router'

function Footer() {
  return (
    <div className={style.footer}>

      <div className={style.footerTop}>

        <ul className={style.footerList}>
          <li className={style.footerTitle}>Contact</li>
          <li>
            <div className={style.icon}>
              <i className="fa fa-phone"></i>
            </div>
            <div>
              <span>Phone Number:</span>
              <a href="tel:+994123456789">+994 12 345 67 89</a>
            </div>
          </li>
          <li>
            <div className={style.icon}>
              <i className="fa fa-envelope"></i>
            </div>
            <div>
              <span>Email:</span>
              <a href="mailto:YKU9I@example.com">YKU9I@example.com</a>
            </div>
          </li>
          <li>
            <div className={style.icon}>
              <i className="fa fa-map-marker"></i>
            </div>
            <div>
              <span>Address:</span>
              <a href="#">Bakı, Azərbaycan</a>
            </div>
          </li>

        </ul>

        <ul className={style.footerList}>

          <li className={style.footerTitle}>Category</li>

          <li><a href="#">Kardioloq</a></li>
          <li><a href="#">Nevroloq</a></li>
          <li><a href="#">Psixiatr</a></li>
          <li><a href="#">Stomotoloq</a></li>
          <li><a href="#">Pediatr</a></li>
        </ul>

        <ul className={style.footerList}>
          <li className={style.footerTitle}>Social Media</li>
          <li><a href="#"><i className="fa-brands fa-facebook"></i> Facebook</a></li>
          <li><a href="#"><i className="fa-brands fa-twitter"></i> Twitter</a></li>
          <li><a href="#"><i className="fa-brands fa-instagram"></i> Instagram</a></li>
          <li><a href="#"><i className="fa-brands fa-linkedin"></i> LinkedIn</a></li>
          <li><a href="#"><i className="fa-brands fa-discord"></i> Discord</a></li>
        </ul>

        <ul className={style.footerList}>
          <li className={style.footerTitle}>Pages</li>

          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/tips">Tips</Link></li>

        </ul>

      </div>
      <div className={style.footerBottom}>
        <p>Copyright ©2025 MedOnline. All rights reserved.</p>
        <ul className={style.footerBottomList}>
          <li><Link to="/">Privacy Policy</Link></li>
          <li><Link to="/">Terms of Service</Link></li>
          <li><Link to="/">Cookie Policy</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Footer