
import React from 'react'
import style from './Home.module.css'
import Carousel from './components/carousel/Carousel'
import AboutUs from './components/aboutus/AboutUs'
import Services from './components/services/Services'
import BlogUs from './components/blogus/BlogUs'
import DoctorList from './components/doctorlist/DoctorList'
import ContactUs from '../about/components/contactus/ContactUs'
import PaymentPlans from './components/payment/PaymentPlans';

function Home() {
  return (
    <div className={style.home}>
      <Carousel />
      <AboutUs  />
      <Services />
      <DoctorList />
      <BlogUs />
      <div className={style.homeContact}>
        <img src="https://html.themehealer.com/careon/assets/images/resources/contact-one-img-1.jpg" alt="" />
        <ContactUs />
      </div>
      <PaymentPlans />
    </div>
  )
}

export default Home