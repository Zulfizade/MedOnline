import React from 'react'
import style from './Home.module.css'
import Carousel from './components/carousel/Carousel'
import AboutUs from './components/aboutus/AboutUs'
import Services from './components/services/Services'
import BlogUs from './components/blogus/BlogUs'

function Home() {
  return (
    <div className={style.home}>
      <Carousel />
      <AboutUs  />
      <Services />
      <BlogUs />
    </div>
  )
}

export default Home