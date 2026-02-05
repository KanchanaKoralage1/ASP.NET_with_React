import React, { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refreshMovies: () => void;

  // If movie exists → Edit mode
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

  // ShowTime list
  const [showTimes, setShowTimes] = useState<string[]>([""]);

  // When Edit button clicked → Fill data
  useEffect(() => {
    if (selectedMovie) {
      setName(selectedMovie.name);
      setImagePreview(selectedMovie.image || "");
      setSeatCount(selectedMovie.seatCount);
      setTicketPrice(selectedMovie.ticketPrice || 0);

      setStatus(
        selectedMovie.movieStatus === 0 ? "Showing" : "ComingSoon"
      );

      // Convert showtimes into string array
      if (selectedMovie.showTimes?.length > 0) {
        setShowTimes(
          selectedMovie.showTimes.map((t: any) =>
            new Date(t.startTime).toISOString().slice(0, 16)
          )
        );
      }
    } else {
      // Reset form when adding
      setName("");
      setImageFile(null);
      setImagePreview("");
      setSeatCount(0);
      setTicketPrice(0);
      setStatus("Showing");
      setShowTimes([""]);
    }
  }, [selectedMovie]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new ShowTime input
  const addShowTimeField = () => {
    setShowTimes([...showTimes, ""]);
  };

  // Update ShowTime field
  const handleShowTimeChange = (index: number, value: string) => {
    const updated = [...showTimes];
    updated[index] = value;
    setShowTimes(updated);
  };

  // Submit Form (Add or Edit)
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("SeatCount", seatCount.toString());
      formData.append("TicketPrice", ticketPrice.toString());
      formData.append("MovieStatus", status === "Showing" ? "0" : "1");
      formData.append("AddDate", new Date().toISOString());

      // Add image file if selected
      if (imageFile) {
        formData.append("ImageFile", imageFile);
      }

      // Add ShowTimes
      showTimes.forEach((time, index) => {
        if (time) {
          formData.append(`ShowTimes[${index}].StartTime`, time);
          formData.append(`ShowTimes[${index}].EndTime`, time);
        }
      });

      //  EDIT MODE
      if (selectedMovie) {
        await axios.put(
          `https://localhost:7267/api/movie/${selectedMovie.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Don't set Content-Type - let browser set it with boundary
            },
          }
        );

        alert("Movie Updated Successfully ✅");
      }

      //  ADD MODE
      else {
        await axios.post(
          "https://localhost:7267/api/movie/addmovie",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Don't set Content-Type - let browser set it with boundary
            },
          }
        );

        alert("Movie Added Successfully 🎉");
      }

      refreshMovies();
      onClose();
    } catch (error) {
      console.log("Movie Save Error", error);
      alert("Something went wrong ");
    }
  };

  // If modal closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {selectedMovie ? " Edit Movie" : " Add Movie"}
        </h2>

        {/* Movie Name */}
        <label className="font-medium">Movie Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded-lg mb-3"
        />

        {/* Image Upload */}
        <label className="font-medium">Movie Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border p-2 rounded-lg mb-3"
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* Seats */}
        <label className="font-medium">Seat Count</label>
        <input
          type="number"
          value={seatCount}
          onChange={(e) => setSeatCount(Number(e.target.value))}
          className="w-full border p-2 rounded-lg mb-3"
        />

        {/* Ticket Price */}
        <label className="font-medium">Ticket Price</label>
        <input
          type="number"
          step="0.01"
          value={ticketPrice}
          onChange={(e) => setTicketPrice(Number(e.target.value))}
          className="w-full border p-2 rounded-lg mb-3"
        />

        {/* Status */}
        <label className="font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded-lg mb-3"
        >
          <option value="Showing">Showing</option>
          <option value="ComingSoon">Coming Soon</option>
        </select>

        {/* ShowTimes */}
        <label className="font-medium">Show Times</label>

        {showTimes.map((time, index) => (
          <input
            key={index}
            type="datetime-local"
            value={time}
            onChange={(e) =>
              handleShowTimeChange(index, e.target.value)
            }
            className="w-full border p-2 rounded-lg mb-2"
          />
        ))}

        <button
          onClick={addShowTimeField}
          className="text-blue-600 font-semibold mb-4"
        >
          + Add Another Time Slot
        </button>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {selectedMovie ? "Update" : "Add Movie"}
          </button>
        </div>
      </div>
    </div>
  );
}