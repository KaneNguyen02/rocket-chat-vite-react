import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

type PrivateRouteProps = {
  children: ReactNode;
};

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isLogin = true;
  const location = useLocation();

  if (!isLogin) {
    return (
      <Navigate to="/sign-in" state={{ from: location.pathname }} replace />
    );
  }
  return children;
};
