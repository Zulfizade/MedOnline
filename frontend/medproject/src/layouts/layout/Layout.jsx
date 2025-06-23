import React, { Suspense } from 'react'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import { Outlet } from 'react-router'
import style from './Layout.module.css'
import Loader from '../components/loader/Loader'

function Layout() {
    return (
        <div className={style.layout}>
            <Header />
            <Suspense fallback={<Loader />}>
                <Outlet />
            </Suspense>
            <Footer />
        </div>
    )
}

export default Layout