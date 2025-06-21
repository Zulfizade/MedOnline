import React from 'react'
import { Link } from 'react-router'
import style from './Header.module.css'

function Header() {
  return (
    <div className={style.header}>

      <div className={style.logo}>
        <Link to="/"> <img src="" alt="Logo" width={"50px"} height={"50px"} /> </Link>
      </div>


      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/category">Category</Link></li>
        <li><Link to="/tips">Tips</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <div className={style.icons}>
        <i className='fa fa-search'></i>
        <i className='fa fa-user'></i>
        <i className='fa-solid fa-bell'></i>
      </div>

      <i className={`fa-solid fa-bars ${style.bars}`}></i>


    </div>
  )
}

export default Header