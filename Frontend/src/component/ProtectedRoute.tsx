import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  allowedRole: string;
};

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Role mismatch
  if (role !== allowedRole) {
    return <Navigate to="/profilepage" />;
  }

  return children;
}
