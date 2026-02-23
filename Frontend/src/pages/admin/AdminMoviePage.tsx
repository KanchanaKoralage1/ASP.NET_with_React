import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminMovieAddUpdate from "./AdminMovieAddUpdate";
import { Film, Plus, Edit, Trash2, Clock, Users, DollarSign } from "lucide-react";

export default function AdminMoviePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://20.212.19.81:5000";

  // Fetch all movies
  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem("token");
      //const API_URL = (import.meta.env.VITE_API_URL ?? "") as string;
      
      const res = await axios.get(`${API_URL}/api/movie/allmovies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies(res.data);
    } catch (error) {
      console.log("Error fetching movies", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete movie handler
  const handleDeleteMovie = async (movieId: number, movieName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${movieName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminMovieAddUpdate
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          refreshMovies={fetchMovies}
          selectedMovie={selectedMovie}
        />

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Film className="text-blue-600" size={40} />
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  Movie Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your movie catalog and showtimes
                </p>
              </div>
            </div>

            {/* Add Movie Button */}
            <button
              onClick={() => {
                setSelectedMovie(null);
                setOpenModal(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus size={20} />
              Add New Movie
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Movies
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {movies.length}
                  </p>
                </div>
                <Film className="text-blue-600" size={36} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Now Showing
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {movies.filter((m) => m.movieStatus === 0).length}
                  </p>
                </div>
                <Clock className="text-green-600" size={36} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Coming Soon
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {movies.filter((m) => m.movieStatus === 1).length}
                  </p>
                </div>
                <Clock className="text-orange-600" size={36} />
              </div>
            </div>
          </div>
        </div>

        {/* Movie Cards Grid */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                {/* Movie Image */}
                <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  {movie.image ? (
                    <img
                      src={`${API_URL}${movie.image}`}
                      alt={movie.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400x600/4F46E5/FFFFFF?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="text-gray-400" size={64} />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                        movie.movieStatus === 0
                          ? "bg-green-500/90 text-white"
                          : "bg-orange-500/90 text-white"
                      }`}
                    >
                      {movie.movieStatus === 0 ? "NOW SHOWING" : "COMING SOON"}
                    </span>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 line-clamp-1">
                    {movie.name}
                  </h2>

                  {/* Movie Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Users className="mr-2 text-blue-500" size={20} />
                      <span className="font-medium">
                        {movie.seatCount} seats available
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <DollarSign className="mr-2 text-green-500" size={20} />
                      <span className="font-medium">
                        LKR {movie.ticketPrice?.toFixed(2) || "0.00"}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Clock className="mr-2 text-purple-500" size={20} />
                      <span className="font-medium">
                        {movie.showTimes?.length || 0} showtimes
                      </span>
                    </div>
                  </div>

                  {/* ShowTimes */}
                  {movie.showTimes?.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Show Times:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {movie.showTimes.slice(0, 3).map((t: any) => (
                          <span
                            key={t.id}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                          >
                            {new Date(t.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        ))}
                        {movie.showTimes.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                            +{movie.showTimes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedMovie(movie);
                        setOpenModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <Edit size={18} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteMovie(movie.id, movie.name)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <Film className="mx-auto text-gray-400 mb-4" size={80} />
            <p className="text-gray-500 text-xl font-medium mb-2">
              No movies found
            </p>
            <p className="text-gray-400 mb-6">
              Start by adding your first movie
            </p>
            <button
              onClick={() => {
                setSelectedMovie(null);
                setOpenModal(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              <Plus size={20} />
              Add First Movie
            </button>
          </div>
        )}
      </div>
    </div>
  );
}