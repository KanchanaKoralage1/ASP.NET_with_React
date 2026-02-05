import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ProfilePage() {

  const[user,setUser]=useState<any>(null);

  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[phoneNumber,setPhoneNumber]=useState("");
  const[image,setImage]=useState("");

  useEffect(()=>
  {
    const fetchProfile=async()=>
    {
      try {

        var token = localStorage.getItem("token");
        var response = await axios.get("https://localhost:7267/api/userprofile/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setUser(response.data)
        setName(response.data.name);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phoneNumber);
        setImage(response.data.image || "");

      } catch (error) {
        console.log("Profile Load Error:", error);
      }
    }
    fetchProfile();
  },[])

  const handleUpdateProfile=async(e:React.FormEvent)=>{
    e.preventDefault();

    try {
      var token = localStorage.getItem("token");
      await axios.put("https://localhost:7267/api/userprofile/edituser",
        {
          name,
          email,
          phoneNumber,
          image
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Profile Updated Successfully!");

    } catch (error) {
      
      console.log("Update Error:", error);
      alert("Update Failed");
    }
  }

  //if (!user) return <h2>Loading Profile...</h2>;

  return (
    <div className='min-h-screen flex bg-gray-50 justify-center items-center'>

      <form className='bg-white p-8 rounded-xl w-[400px] shadow-lg' onSubmit={handleUpdateProfile}>
        <h1>Customer Profile</h1>

        <label>Profile image</label>
        <input type="image" 
        className='rounded w-full mb-4 p-3'
        />

        <label>Name</label>
        <input 
        type="text" 
        className='w-full border p-3 rounded mb-4'
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />

        <label>Email</label>
        <input 
        type="text" 
        className='w-full border p-3 rounded mb-4'
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />

        <label>Phone Number</label>
        <input 
        type="text" 
        className='w-full border p-3 rounded mb-4'
        value={phoneNumber}
        onChange={(e)=>setPhoneNumber(e.target.value)}
        />

        <button className='w-full border bg-green-600 w-full rounded-lg p-3 mt-5 drop-shadow-2xl text-white font-bold hover:bg-green-800 '>Updated</button>
        <button className='w-full border bg-red-600 w-full rounded-lg p-3 mt-5 drop-shadow-2xl text-white font-bold hover:bg-red-800 '>Cancel</button>
      </form>
      
    </div>
  )
}
