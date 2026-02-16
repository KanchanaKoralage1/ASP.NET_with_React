import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { User, Mail, Phone, Camera, Save, X, Upload } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://20.212.19.81:5000";

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/userprofile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("User data:", response.data);
      console.log("Image path:", response.data.image);

      setUser(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
      setPhoneNumber(response.data.phoneNumber || "");
      setImage(response.data.image || "");
      
      // Construct full image URL with leading slash
      if (response.data.image) {
        const imagePath = response.data.image.startsWith('/') 
          ? response.data.image 
          : `/${response.data.image}`;
        const fullImageUrl = `${API_URL}${imagePath}`;
        console.log("Full image URL:", fullImageUrl);
        setImagePreview(fullImageUrl);
      }
    } catch (error) {
      console.error("Profile Load Error:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchProfile();
}, [API_URL]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, PNG, and GIF files are allowed");
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      
      if (imageFile) {
        formData.append("ImageFile", imageFile);
      }

      const response = await axios.put(
        `${API_URL}/api/userprofile/edituser`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update response:", response.data); // Debug log

      alert("Profile Updated Successfully!");
      
      if (response.data.user) {
        setUser(response.data.user);
        setImage(response.data.user.image || "");
        
        if (response.data.user.image) {
          const fullImageUrl = `${API_URL}${response.data.user.image}`;
          console.log("Updated image URL:", fullImageUrl); // Debug log
          setImagePreview(fullImageUrl);
        }
      }
      
      setImageFile(null);
    } catch (error: any) {
      console.error("Update Error:", error);
      alert(error.response?.data?.message || "Update Failed");
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber || "");
    setImagePreview(user.image ? `${API_URL}${user.image}` : "");
    setImageFile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 justify-center items-center p-4'>
      <form 
        className='bg-white p-8 rounded-2xl w-full max-w-md shadow-xl border border-gray-100' 
        onSubmit={handleUpdateProfile}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-500">Update your personal information</p>
        </div>

        {/* Profile Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
            Profile Picture
          </label>
          
          <div className="flex flex-col items-center">
            {/* Image Preview */}
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", imagePreview);
                      // Show default user icon on error
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log("Image loaded successfully:", imagePreview);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="text-gray-400" size={48} />
                  </div>
                )}
                
                {/* Fallback User Icon (shown if image fails) */}
                {imagePreview && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <User className="text-gray-400" size={48} style={{ display: 'none' }} id="fallback-icon" />
                  </div>
                )}
              </div>
              
              {/* Camera Icon Button */}
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:scale-110"
              >
                <Camera size={20} />
              </label>
            </div>

            {/* Hidden File Input */}
            <input
              id="profile-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Upload Info */}
            <p className="text-xs text-gray-500 text-center">
              {imageFile ? (
                <span className="text-blue-600 font-medium flex items-center gap-1 justify-center">
                  <Upload size={14} />
                  {imageFile.name}
                </span>
              ) : (
                "Click the camera icon to upload (Max 5MB)"
              )}
            </p>
          </div>
        </div>

        {/* Name Input */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <User className="text-blue-600" size={18} />
            Name
          </label>
          <input
            type="text"
            className='w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email Input */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Mail className="text-blue-600" size={18} />
            Email
          </label>
          <input
            type="email"
            className='w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Phone Number Input */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Phone className="text-blue-600" size={18} />
            Phone Number
          </label>
          <input
            type="tel"
            className='w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className='flex-1 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg p-3 font-semibold transition-all duration-300 flex items-center justify-center gap-2'
          >
            <X size={18} />
            Cancel
          </button>
          
          <button
            type="submit"
            className='flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg p-3 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2'
          >
            <Save size={18} />
            Update
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Member since {new Date(user.dateJoined).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        )}
      </form>
    </div>
  )
}