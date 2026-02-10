import React from "react";
import NavBar from "../pages/customer/NavBar";
import AdminSidebar from "../pages/admin/AdminSidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
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
      <div className="p-6">{children}</div>
    </div>
  );
}
