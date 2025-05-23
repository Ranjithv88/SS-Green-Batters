"use client";

import React, { useState, useEffect } from 'react';
import './style/NavBar.scss';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { signOut, useSession } from "next-auth/react";

const MenuNavigation = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUserName(session.user.name);
    } else {
      setUserName(null);
    }
  }, [status, session]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <div className='navbarEmpty'/>
      <div className="mainContainer" id="mainContainer">
        <div className="container">
          <h1 className="title">SS Green Batters</h1>

          <nav className="nav">
            <Link href="/" className="btn">Home</Link>

            <div className="dropdown">Menu
              <div className="dropdown-content">
                <a href="#Dust">Dust</a>
                <a href="#WaterSoluble">WaterSoluble</a>
                <a href="#Bio">Bio</a>
                <a href="#Micronutrients">Micronutrients</a>
                <a href="#LiquidFertilizers">LiquidFertilizers</a>
                <a href="#Granules">Granules</a>
                <a href="#Others">Others</a>
                <a href="#Atharv">Atharv</a>
                <a href="#Ratol">Ratol</a>
              </div>
            </div>

            <a href="#footer" className="btn">About</a>
          </nav>

          <div>
            {userName ? (
              <>
                <Link href="/dashboard" className="btn">{userName}</Link>
                <button className="btn" type="button" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button className="btn" type="button" onClick={handleLogin}>Login</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuNavigation;

