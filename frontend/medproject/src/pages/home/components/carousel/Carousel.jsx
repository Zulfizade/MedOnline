import React, { useState, useEffect, useRef } from 'react'
import style from './Carousel.module.css'

// Şəkilləri və yazıları burada dəyiş
const slides = [
  {
    img: '/carousel_photos/bitki.jpg',
    caption: 'Take the first step toward better health with the power of nature.\nMedOnline brings you both natural balance and medical science in one place.'
  },
  {
    img: '/carousel_photos/doctor.jpg',
    caption: 'Connect instantly with professional and experienced doctors.\nThe trusted care you deserve is now just a tap away.'
  },
  {
    img: '/carousel_photos/onlinechat.jpg',
    caption: 'Anytime, anywhere.\nWith MedOnline, your doctor is always with you, offering fast and convenient care whenever you need it.'
  },
  {
    img: '/carousel_photos/recept.jpg',
    caption: 'Receive your doctor-approved prescriptions directly on your phone.\nSimple, secure, and fast.'
  },
  {
    img: '/carousel_photos/without.jpg',
    caption: 'Stop wasting hours in queues.\nWith MedOnline, getting medical advice is now faster, easier, and completely stress-free.'
  },
]

function Carousel() {
  const [current, setCurrent] = useState(0)
  const timeoutRef = useRef(null)

  // Avtomatik keçid
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearTimeout(timeoutRef.current)
  }, [current])

  const goTo = idx => setCurrent(idx)
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length)
  const next = () => setCurrent((current + 1) % slides.length)

  return (
    <div className={style.carousel}>
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`${style.slide} ${idx === current ? style.active : ''}`}
          style={{ backgroundImage: `url(${slide.img})` }}
          aria-hidden={idx !== current}
        >
          <div className={style.overlay}></div>
          <div className={style.caption}>
            {slide.caption.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i !== slide.caption.split('\n').length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>
      ))}
      <button
        className={style.arrow + ' ' + style.left}
        onClick={prev}
        aria-label="Prev"
        tabIndex={0}
      >&#10094;</button>
      <button
        className={style.arrow + ' ' + style.right}
        onClick={next}
        aria-label="Next"
        tabIndex={0}
      >&#10095;</button>
      <div className={style.dots}>
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={idx === current ? style.dotActive : style.dot}
            onClick={() => goTo(idx)}
            tabIndex={0}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel