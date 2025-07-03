import React from 'react'
import style from './About.module.css'
import AboutHeader from './components/headerus/AboutHeader'
import CategoryUs from './components/categoryus/CategoryUs'
import ServicesUs from './components/servicesus/ServicesUs'
import TipsUs from './components/tipsus/TipsUs'
import ContactUs from './components/contactus/ContactUs'

function About() {
  return (
    <div className={style.about}>
      <AboutHeader />
      <CategoryUs />
      <ServicesUs />
      <TipsUs />
      <ContactUs  />
    </div>
  )
}

export default About