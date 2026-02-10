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

            //https://localhost:7267
            alert("Signup Successful");
            console.log("Response", response.data)

        } catch (error) {

            console.error("Signup Error", error);
            alert("Signup Failed");
        }
    }

  return (

    <div className='bg-gray-100 flex justify-center min-h-screen'>
        <form onSubmit={handleSignup} className='bg-white p-8 rounded-2xl drop-shadow-lg w-[400px] h-[600px] mt-20'>

            <h1 className='text-center mb-6 font-bold text-3xl p-8'>Create Account</h1>

            <label className=''>Name</label>

            <input type='text' 
            placeholder='Enter Your Name' 
            className='w-full border p-3 rounded-lg mb-4'
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
            <label className=''>Email</label>
            <input type='email' 
            placeholder='usermail@gmail.com' 
            className='w-full border p-3 rounded-lg mb-4'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <label className=''>Password</label>
            <input type='password' 
            placeholder='Enter your password' 
            className='w-full border p-3 rounded-lg mb-4'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <button 
            type='submit'
            className='bg-green-600 w-full rounded-lg p-3 mt-5 drop-shadow-2xl text-white font-bold hover:bg-green-800'>
                Signup
            </button>

            <p className='mt-5 text-center p-3'>Already have an Account ? <a href="/login">Login</a></p>
        </form>
      
    </div>
  )
}
