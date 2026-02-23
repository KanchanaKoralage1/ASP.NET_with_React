import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Film, User, Ticket, LogOut, LogIn, UserPlus } from "lucide-react";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("intendedBooking");
    navigate("/movies");
  };

  // Check if link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link 
            to="/movies" 
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl group-hover:bg-white/30 transition-all duration-300">
              <Film className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                MovieZone
              </h1>
              <p className="text-xs text-blue-100">Your Cinema Experience</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              to="/movies"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive("/movies")
                  ? "bg-white text-blue-600 shadow-lg"
                  : "text-white hover:bg-white/20 backdrop-blur-sm"
              }`}
            >
              <Film size={18} />
              <span className="hidden sm:inline">Movies</span>
            </Link>

            {token && (
              <>
                <Link
                  to="/profilepage"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    isActive("/profilepage")
                      ? "bg-white text-blue-600 shadow-lg"
                      : "text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <User size={18} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <Link
                  to="/bookings"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    isActive("/bookings")
                      ? "bg-white text-blue-600 shadow-lg"
                      : "text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <Ticket size={18} />
                  <span className="hidden sm:inline">Bookings</span>
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                
                <Link
                  to="/signup"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <UserPlus size={18} />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}