import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Shield, Users } from 'lucide-react';

type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  role: number;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = (import.meta.env.VITE_API_URL ?? "") as string;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/userprofile/list`);
      setUsers(response.data);
    } catch (error) {
      console.log("Error fetching users", error);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: number) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("You must be logged in as admin");
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/userprofile/changerole/${userId}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(response.data.message);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error: any) {
      console.error("Role change error:", error);
      if (error.response?.status === 400) {
        alert(error.response.data);
      } else if (error.response?.status === 401) {
        alert("Unauthorized. Admin access required.");
      } else {
        alert("Failed to change user role");
      }
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("You must be logged in as admin");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/userprofile/delete/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      
      // Remove user from local state
      setUsers(users.filter(user => user.id !== userId));
    } catch (error: any) {
      console.error("Delete user error:", error);
      if (error.response?.status === 400) {
        alert(error.response.data);
      } else if (error.response?.status === 401) {
        alert("Unauthorized. Admin access required.");
      } else if (error.response?.status === 404) {
        alert("User not found");
      } else {
        alert("Failed to delete user");
      }
    }
  };

  const getRoleName = (role: number) => {
    return role === 1 ? "Admin" : "Customer";
  };

  const getRoleBadgeColor = (role: number) => {
    return role === 1 
      ? "bg-purple-100 text-purple-800 border-purple-300" 
      : "bg-blue-100 text-blue-800 border-blue-300";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="mr-3 text-blue-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
          </div>
          <p className="text-center text-gray-600">
            Manage user roles and accounts
          </p>
        </div>

        {/* Users Table */}
        <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="p-4 text-left font-semibold">ID</th>
                  <th className="p-4 text-left font-semibold">Name</th>
                  <th className="p-4 text-left font-semibold">Email</th>
                  <th className="p-4 text-left font-semibold">Phone</th>
                  <th className="p-4 text-left font-semibold">Joined Date</th>
                  <th className="p-4 text-center font-semibold">Role</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="p-4 text-gray-700 font-medium">{user.id}</td>
                    <td className="p-4 text-gray-800 font-medium">{user.name}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">{user.phoneNumber || "N/A"}</td>
                    <td className="p-4 text-gray-600">
                      {new Date(user.dateJoined).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <select
                          className={`px-4 py-2 rounded-lg border-2 font-semibold cursor-pointer transition-all duration-200 hover:shadow-md ${getRoleBadgeColor(user.role)}`}
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, parseInt(e.target.value))}
                        >
                          <option value={0}>Customer</option>
                          <option value={1}>Admin</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                        >
                          <Trash2 size={18} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {users.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          )}
        </div>

        {/* Stats Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{users.length}</p>
              </div>
              <Users className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Admins</p>
                <p className="text-3xl font-bold text-purple-600">
                  {users.filter(u => u.role === 1).length}
                </p>
              </div>
              <Shield className="text-purple-600" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Customers</p>
                <p className="text-3xl font-bold text-blue-600">
                  {users.filter(u => u.role === 0).length}
                </p>
              </div>
              <Users className="text-blue-600" size={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}