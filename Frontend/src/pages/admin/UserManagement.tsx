import React,{useEffect, useState} from 'react'
import axios from 'axios' 

type User={
    id:number;
    name:string;
    email:string;
    phoneNumber:string;
    joinedDate:string;
    role:number;
}

export default function UserManagement() {

    const[users,setUsers]=useState<User[]>([]);

    const fetchUsers=async()=>
    {
        try {
            //const response=await axios.get("https://localhost:7267/api/userprofile/list")
            const API_URL = (import.meta.env.VITE_API_URL ?? "") as string;
            const response=await axios.get(`${API_URL}/api/userprofile/list`)
            setUsers(response.data);

        } catch (error) {
            console.log("Error fetching users", error);
        }
    }

    useEffect(()=>{
        fetchUsers();
    },[])

    const getRoleName=(role:number)=>
    {
        return role==1 ? "Admin":"Customer"; 
    }

  return (
    <div className='p-10 bg-gray-50 min-h-screen'>
      <h1 className='text-3xl text-center font-bold mb-6'>User management</h1>

      <div className='bg-white overflow-x-auto shadow-lg rounded-1xl'>
        <table className='border-collapse w-full'>
            <thead className='bg-gray-200'>
                <tr>
                    <th className='p-3 border'>ID</th>
                    <th className='p-3 border'>Name</th>
                    <th className='p-3 border'>Email</th>
                    <th className='p-3 border'>Phone Number</th>
                    <th className='p-3 border'>Joined Date</th>
                    <th className='p-3 border'>Role</th>
                    <th className='p-3 border'>Action</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user)=>(
                    <tr key={user.id}>
                        <td className='p-3 border text-center'>{user.id}</td>
                        <td className='p-3 border text-center'>{user.name}</td>
                        <td className='p-3 border text-center'>{user.email}</td>
                        <td className='p-3 border text-center'>{user.phoneNumber||"N/A"}</td>
                        <td className='p-3 border text-center'>{new Date(user.joinedDate).toLocaleDateString()}</td>
                        <td className="p-3 border">
                            <select
                                className="border rounded p-2"
                                value={user.role}
                                onChange={(e) =>
                                console.log("Role change:", user.id, e.target.value)
                                }
                            >
                                <option value={0}>Customer</option>
                                <option value={1}>Admin</option>
                            </select>
                        </td>
                        <td className="p-3 border">
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
                                onClick={() => alert("Delete user " + user.id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  )
}
