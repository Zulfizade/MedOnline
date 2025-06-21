import React from 'react'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import { Outlet } from 'react-router'
import style from './Layout.module.css'

function Layout() {
    return (
        <div className={style.layout}>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout