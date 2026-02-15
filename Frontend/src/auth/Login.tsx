import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const API_URL = (import.meta.env.VITE_API_URL ?? "") as string;
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        {
          email,
          passwordHash: password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      if (response.data.role === "Admin") {
        navigate("/adminsidebar");
      } else {
        navigate("/movies");
      }

      console.log("Response", response.data);
    } catch (error) {
      alert("Login Failed");
      console.error("Login Error", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
    
    <form
      onSubmit={handleLogin}
      className="bg-white w-full max-w-md p-10 rounded-3xl shadow-xl border border-gray-100"
    >
      {/* Title */}
      <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-8">
        Welcome Back 
      </h1>

      {/* Email */}
      <label className="block text-sm font-semibold text-gray-600 mb-2">
        Email
      </label>
      <input
        type="email"
        placeholder="usermail@gmail.com"
        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition mb-5"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password */}
      <label className="block text-sm font-semibold text-gray-600 mb-2">
        Password
      </label>
      <input
        type="password"
        placeholder="Enter your password"
        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition mb-6"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-lg shadow-md hover:opacity-90 hover:scale-[1.02] transition duration-300"
      >
        Login
      </button>

      {/* Footer */}
      <p className="mt-6 text-center text-gray-600 text-sm">
        Don’t have an account?{" "}
        <a
          href="/signup"
          className="text-blue-600 font-semibold hover:underline"
        >
          Sign Up
        </a>
      </p>
    </form>
  </div>
  );
}
