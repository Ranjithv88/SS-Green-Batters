"use client";

import { SessionProvider } from "next-auth/react";

// AuthProvider component to wrap the session context
const AuthProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;

