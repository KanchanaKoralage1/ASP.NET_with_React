import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="w-full bg-white shadow-md px-8 py-4 flex justify-between items-center">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600">
        🎬 MovieZone
      </h1>

      {/* Links */}
      <div className="flex gap-6 font-medium text-gray-700">
        <Link to="/movies" className="hover:text-blue-600 transition">
          Movies
        </Link>

        {token && (
          <>
            <Link to="/profilepage" className="hover:text-blue-600 transition">
              My Profile
            </Link>

            <Link to="/mybookings" className="hover:text-blue-600 transition">
              Bookings
            </Link>
             <Link to="/movie" className="hover:text-blue-600 transition">
              Movies
            </Link>
          </>
        )}
      </div>

      {/* Login / Logout Button */}
      {!token ? (
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          Login
        </Link>
      ) : (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      )}
    </div>
  );
}
