// src/routes/ProtectedRoute.tsx
import React, { useContext, } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // 🔄 loading state
  if (user === undefined) {
    return React.createElement("div", null, "Loading...");
  }

  // 🔐 not logged in
  if (!user) {
    return React.createElement(Navigate, {
      to: "/login",
      replace: true,
      state: { from: location },
    });
  }

  // ✅ authorized
  return React.createElement(React.Fragment, null, children);
};

export default ProtectedRoute;