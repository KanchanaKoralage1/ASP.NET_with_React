import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Film, 
  Calendar, 
  LogOut,
  ChevronRight
} from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "User Management", path: "/usermanagement", icon: Users },
    { name: "Movies", path: "/admin/moviemanagement", icon: Film },
    { name: "Bookings", path: "/adminbookings", icon: Calendar },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col h-screen sticky top-0 shadow-2xl">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Film className="text-blue-400" size={32} />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>
        <p className="text-center text-gray-400 text-sm">
          Movie Management System
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center justify-between p-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50"
                      : "hover:bg-gray-700/50 hover:translate-x-1"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    size={20} 
                    className={isActive ? "text-white" : "text-gray-400 group-hover:text-white"}
                  />
                  <span className={`font-medium ${isActive ? "text-white" : "text-gray-300"}`}>
                    {item.name}
                  </span>
                </div>
                {isActive && (
                  <ChevronRight size={18} className="text-white" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Info Section (Optional) */}
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-800 rounded-xl p-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Admin User</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 p-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-200 transform hover:scale-105"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}