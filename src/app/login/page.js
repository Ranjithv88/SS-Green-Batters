"use client"

import './login.scss';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [process, setProcess] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setProcess(true)
      try {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (res?.error) {
          setError("Invalid Credentials");
          return;
        }

        router.replace("dashboard");
      } catch (error) {
        console.log(error);
      }finally{ 
       setProcess(false)
      }
    };
    return (
      <div className='login'>
        <form className="form" autoComplete="off" onSubmit={handleSubmit} >
          <div className="control">
            <h1><Link className='Back' href={'/'}></Link>Login</h1>
          </div>
    
          <div className="control block-cube block-input">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            <div className="bg-top">
              <div className="bg-inner"></div>
            </div>
            <div className="bg-right">
              <div className="bg-inner"></div>
            </div>
            <div className="bg">
              <div className="bg-inner"></div>
            </div>
          </div>
    
          <div className="control block-cube block-input">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <div className="bg-top">
              <div className="bg-inner"></div>
            </div>
            <div className="bg-right">
              <div className="bg-inner"></div>
            </div>
            <div className="bg">
              <div className="bg-inner"></div>
            </div>
          </div>
    
          <button className="btn block-cube block-cube-hover" type="submit" >
            <div className="bg-top">
              <div className="bg-inner"></div>
            </div>
            <div className="bg-right">
              <div className="bg-inner"></div>
            </div>
            <div className="bg">
              <div className="bg-inner"></div>
            </div>
            <div className="text">{process?"Loading...":"Log In"}</div>
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    );
}

  