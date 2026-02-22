import React from "react";
import NavBar from "../pages/customer/NavBar";
import AdminSidebar from "../pages/admin/AdminSidebar";
import { useLocation } from "react-router-dom";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const role = localStorage.getItem("role");

  // Admin Layout
  if (role === "Admin") {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6">{children}</div>
      </div>
    );
  }

  // Customer or Guest Layout
  return (
    <div>
      <NavBar />
      <div className="">{children}</div>
    </div>
  );
}
