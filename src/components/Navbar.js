"use client"

import React, { useState } from 'react'
import './style/NavBar.scss'
import { useRouter } from "next/navigation"

const MenuNavigation = () => {
    const [process, setProcess] = useState(false)
    const router = useRouter()

    const LoginButton = async() => {
      setProcess(true)
      router.push('./login')
      setProcess(false)
    }

  return (
    <div className="mainContainer">
        <div className="container">
            <h1 className="title">SS Green Batters</h1>
            <nav className="nav">
            <a href="#mainStockSummary" className="btn">Stock Summary</a>
            <a href="#" className="btn">Water Soluble</a>
            <a href="#footer" className="btn">About</a>
            </nav>
            <button className="btn" type='button' style={{pointerEvents:`${process?'none':'normal'}`}} onClick={LoginButton}>{process?'Loading...':'LogIn'}</button>
        </div>
    </div>
  );
};

export default MenuNavigation;

