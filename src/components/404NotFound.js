import React from 'react'
import './style/404NotFound.scss'
import Link from "next/link"

function NotFound() {
  return (
    <div className="site">
        <div className="sketch">
          <div className="bee-sketch red"></div>
          <div className="bee-sketch blue"></div>
        </div>
        <h1>
          404:
          <small>Players Not Found</small>
          <Link className='Back' href={'/'}></Link>
        </h1>
    </div>
  )
}

export default NotFound

