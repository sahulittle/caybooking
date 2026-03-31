import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();

  // Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const activeRole = user?.activeRole || user?.role;

  // 1. Check if user is authenticated
  if (!user) {
    // Redirect to login, saving the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if user has the correct role
  if (allowedRoles && !allowedRoles.includes(activeRole)) {
    // User is logged in but unauthorized; redirect to home
    return <Navigate to="/" replace />;
  }

  // 3. Render the protected component
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
