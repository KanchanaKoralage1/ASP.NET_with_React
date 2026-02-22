import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Upload, Plus, Trash2, Film } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refreshMovies: () => void;
  selectedMovie?: any;
}

export default function AdminMovieAddUpdate({
  isOpen,
  onClose,
  refreshMovies,
  selectedMovie,
}: Props) {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [seatCount, setSeatCount] = useState(0);
  const [status, setStatus] = useState("Showing");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [showTimes, setShowTimes] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMovie) {
      setName(selectedMovie.name);
      setImagePreview(selectedMovie.image || "");
      setSeatCount(selectedMovie.seatCount);
      setTicketPrice(selectedMovie.ticketPrice || 0);
      setStatus(selectedMovie.movieStatus === 0 ? "Showing" : "ComingSoon");

      if (selectedMovie.showTimes?.length > 0) {
        setShowTimes(
          selectedMovie.showTimes.map((t: any) =>
            new Date(t.startTime).toISOString().slice(0, 16)
          )
        );
      }
    } else {
      setName("");
      setImageFile(null);
      setImagePreview("");
      setSeatCount(0);
      setTicketPrice(0);
      setStatus("Showing");
      setShowTimes([""]);
    }
  }, [selectedMovie]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addShowTimeField = () => {
    setShowTimes([...showTimes, ""]);
  };

  const removeShowTimeField = (index: number) => {
    setShowTimes(showTimes.filter((_, i) => i !== index));
  };

  const handleShowTimeChange = (index: number, value: string) => {
    const updated = [...showTimes];
    updated[index] = value;
    setShowTimes(updated);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter a movie name");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("SeatCount", seatCount.toString());
      formData.append("TicketPrice", ticketPrice.toString());
      formData.append("MovieStatus", status === "Showing" ? "0" : "1");
      formData.append("AddDate", new Date().toISOString());

      if (imageFile) {
        formData.append("ImageFile", imageFile);
      }

      showTimes.forEach((time, index) => {
        if (time) {
          formData.append(`ShowTimes[${index}].StartTime`, time);
          formData.append(`ShowTimes[${index}].EndTime`, time);
        }
      });

      const API_URL = (import.meta.env.VITE_API_URL ?? "") as string;

      if (selectedMovie) {
        await axios.put(
          `${API_URL}/api/movie/${selectedMovie.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Movie Updated Successfully ✅");
      } else {
        await axios.post(`${API_URL}/api/movie/addmovie`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Movie Added Successfully 🎉");
      }

      refreshMovies();
      onClose();
    } catch (error) {
      console.log("Movie Save Error", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film size={32} />
            <h2 className="text-2xl font-bold">
              {selectedMovie ? "Edit Movie" : "Add New Movie"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-5">
            {/* Movie Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Movie Name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter movie name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Movie Poster
              </label>
              <div className="flex items-start gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Upload size={20} />
                      <span className="font-medium">
                        {imageFile ? imageFile.name : "Choose an image"}
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-40 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                    />
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Seat Count & Ticket Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seat Count *
                </label>
                <input
                  type="number"
                  value={seatCount}
                  onChange={(e) => setSeatCount(Number(e.target.value))}
                  placeholder="100"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ticket Price (LKR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(Number(e.target.value))}
                  placeholder="500.00"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Movie Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="Showing">Now Showing</option>
                <option value="ComingSoon">Coming Soon</option>
              </select>
            </div>

            {/* ShowTimes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  Show Times
                </label>
                <button
                  onClick={addShowTimeField}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  <Plus size={16} />
                  Add Time Slot
                </button>
              </div>

              <div className="space-y-3">
                {showTimes.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="datetime-local"
                      value={time}
                      onChange={(e) =>
                        handleShowTimeChange(index, e.target.value)
                      }
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {showTimes.length > 1 && (
                      <button
                        onClick={() => removeShowTimeField(index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>{selectedMovie ? "Update Movie" : "Add Movie"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}