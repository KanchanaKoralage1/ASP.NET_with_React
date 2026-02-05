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
        navigate("/admin/usermanagement");
      } else {
        navigate("/profilepage");
      }

      console.log("Response", response.data);
    } catch (error) {
      alert("Login Failed");
      console.error("Login Error", error);
    }
  };
  return (
    <div className="bg-gray-50 flex justify-center min-h-sceen">
      <form
        className="bg-white p-8 w-[400px] h-[600px] mt-20 rounded-2xl drop-shadow-lg"
        onSubmit={handleLogin}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login page</h1>

        <label>Email</label>
        <input
          placeholder="usermail@gmail.com"
          className="w-full border p-3 rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          placeholder="Enter your password"
          className="w-full border p-3 rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 w-full rounded-lg p-3 mt-5 drop-shadow-2xl text-white font-bold hover:bg-blue-800"
        >
          Login
        </button>

        <p className="mt-5 text-center p-3">
          Do not have an Account ? <a href="/signup">SignUp</a>
        </p>
      </form>
    </div>
  );
}
