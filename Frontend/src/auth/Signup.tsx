import React, { useState } from 'react'
import axios from 'axios'

export default function Signup() {

    const[name,setName]=useState('');
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');

    const handleSignup=async(e:React.FormEvent)=>
    {
        e.preventDefault();

        try {
            const API_URL = (import.meta.env.VITE_API_URL ?? "") as string;
            const response=await axios.post(`${API_URL}/api/users/signup`,
                {
                    name,email,passwordHash:password
                }
            );

            alert("Signup Successful");
            console.log("Response", response.data)

        } catch (error) {

            console.error("Signup Error", error);
            alert("Signup Failed");
        }
    }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
    
    <form
      onSubmit={handleSignup}
      className="bg-white w-full max-w-md p-10 rounded-3xl shadow-xl border border-gray-100"
    >
      {/* Title */}
      <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-8">
        Create Account 
      </h1>

      {/* Name */}
      <label className="block text-sm font-semibold text-gray-600 mb-2">
        Name
      </label>
      <input
        type="text"
        placeholder="Enter your name"
        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition mb-5"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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
        Signup
      </button>

      {/* Footer */}
      <p className="mt-6 text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Login
        </a>
      </p>
    </form>
  </div>
  )
}
