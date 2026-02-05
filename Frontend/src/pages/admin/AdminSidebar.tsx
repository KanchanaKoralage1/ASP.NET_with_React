import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "User Management", path: "/admin/usermanagement" },
    { name: "Movies", path: "/admin/movies" },
    { name: "Bookings", path: "/admin/bookings" },
  ];

  return (
    <div className="flex h-screen">
      
      {/* Sidebar */}
      <div className="w-[250px] bg-gray-900 text-white flex flex-col p-6">
        
        <h1 className="text-2xl font-bold mb-10 text-center">
          🎬 Admin Panel
        </h1>

        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-3 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex-grow"></div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
          }}
          className="bg-red-600 hover:bg-red-700 p-3 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Main Page Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
