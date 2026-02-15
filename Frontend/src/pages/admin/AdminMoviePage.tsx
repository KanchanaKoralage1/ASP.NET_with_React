import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminMovieAddUpdate from "./AdminMovieAddUpdate";

export default function AdminMoviePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch all movies
  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem("token");

      const API_URL = (import.meta.env.VITE_API_URL ?? "") as string;
      const res = await axios.get(
        `${API_URL}/api/movie/allmovies`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMovies(res.data);
    } catch (error) {
      console.log("Error fetching movies", error);
    }
  };

  // Delete movie handler
  const handleDeleteMovie = async (movieId: number, movieName: string) => {
    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${movieName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://localhost:7267/api/movie/${movieId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh the movies list after deletion
      fetchMovies();
      
      alert(`Movie "${movieName}" deleted successfully!`);
    } catch (error: any) {
      console.error("Error deleting movie:", error);
      alert(
        error.response?.data?.message || 
        "Failed to delete movie. Please try again."
      );
    }
  };

  // Load movies when page opens
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="p-6">
      <AdminMovieAddUpdate
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        refreshMovies={fetchMovies}
        selectedMovie={selectedMovie}
      />

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          🎬 Movie Management
        </h1>

        {/* Add Movie Button */}
        <button
          onClick={() => {
            setSelectedMovie(null);
            setOpenModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md"
        >
          + Add Movie
        </button>
      </div>

      {/* Movie Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Movie Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Seats</th>
              <th className="p-4">ShowTimes</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <tr
                  key={movie.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">{movie.id}</td>
                  <td className="p-4 font-semibold">{movie.name}</td>

                  {/* Status */}
                  <td className="p-4">
                    {movie.movieStatus === 0 ? (
                      <span className="text-green-600 font-medium">
                        Showing
                      </span>
                    ) : (
                      <span className="text-orange-600 font-medium">
                        Coming Soon
                      </span>
                    )}
                  </td>

                  {/* Seat Count */}
                  <td className="p-4">{movie.seatCount}</td>

                  {/* ShowTimes */}
                  <td className="p-4">
                    {movie.showTimes?.length > 0 ? (
                      movie.showTimes.map((t: any) => (
                        <div key={t.id} className="text-sm text-gray-600">
                          ⏰ {new Date(t.startTime).toLocaleTimeString()}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">No Times</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedMovie(movie);
                        setOpenModal(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg"
                    >
                      Edit
                    </button>

                    <button 
                      onClick={() => handleDeleteMovie(movie.id, movie.name)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  No Movies Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}