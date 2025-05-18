"use client";

import React, { useEffect, useState } from "react";
import './dashboard.scss';
import { signOut, useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import NotFound from "@/components/404NotFound";

const UserInformation = () => {
  const { data: session, status } = useSession();
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    if (status !== 'loading') {
      setLoadingDone(true);
    }
  }, [status]);

  if (!loadingDone) {
    return <Loading />;
  }

  if (!session) {
    return <NotFound />;
  }

  const userName = session.user?.name;
  const userEmail = session.user?.email;

  return (
    <div className="user-information-container">
      <div className="user-information-card">
        <div className="user-info">
          Name: <span className="user-info-bold">{userName}</span>
        </div>
        <div className="user-info">
          Email: <span className="user-info-bold">{userEmail}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="user-info-logout-btn"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserInformation;

