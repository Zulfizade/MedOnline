import React from 'react'
import style from './ErrorPage.module.css'

function ErrorPage() {
  return (
    <div className={style.errorPage}>
      <h1 className={style.title}>Error 404</h1>
      <p className={style.message}>Page not found</p>
    </div>
  )
}

export default ErrorPage