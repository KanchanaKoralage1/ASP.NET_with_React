import React, { useState, useEffect } from "react";
import axios from "axios";
import BookNowPage from "../pages/customer/BookNowPage"; 
import { TvMinimalPlay, Search, Calendar, Users, DollarSign, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ShowTime {
  id: number;
  startTime: string;
  endTime: string;
}

interface MovieType {
  id: number;
  name: string;
  image: string;
  movieStatus: number;
  seatCount: number;
  ticketPrice: number;
  showTimes: ShowTime[];
}

export default function Movie() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);

  const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5175") as string;
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return !!(token && role === "Customer");
  };

  // Handle Book Now Click
  const handleBookNowClick = (movie: MovieType) => {
    if (!isLoggedIn()) {
      localStorage.setItem("intendedBooking", JSON.stringify(movie));
      navigate("/login", { state: { from: "/movies", movieId: movie.id } });
      return;
    }
    
    setSelectedMovie(movie);
    setIsBookingOpen(true);
  };

  // Fetch all movies - NO AUTHENTICATION REQUIRED
  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/movie/allmovies`);
      console.log("Fetched movies:", response.data);
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Filter Movies by Tab + Search
  const filteredMovies = movies.filter((movie) => {
    if (activeTab === "Showing" && movie.movieStatus !== 0) return false;
    if (activeTab === "ComingSoon" && movie.movieStatus !== 1) return false;
    if (!movie.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <TvMinimalPlay className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
          </div>
          <p className="text-gray-600 font-medium">Loading amazing movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 px-4 shadow-xl">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center mb-4">
            <TvMinimalPlay className="mr-3 drop-shadow-lg" size={48} />
            <h1 className="text-5xl font-extrabold tracking-tight">
              Now Showing
            </h1>
          </div>
          <p className="text-center text-blue-100 text-lg max-w-2xl mx-auto">
            Discover the latest blockbusters and upcoming releases. Book your tickets now!
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-10 space-y-6">
          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-200 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-lg"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => setActiveTab("All")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                activeTab === "All"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg hover:scale-105"
              }`}
            >
              All Movies
            </button>

            <button
              onClick={() => setActiveTab("Showing")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                activeTab === "Showing"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg hover:scale-105"
              }`}
            >
              Now Showing
            </button>

            <button
              onClick={() => setActiveTab("ComingSoon")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                activeTab === "ComingSoon"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg hover:scale-105"
              }`}
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Movie Cards Grid */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-3xl shadow-xl">
              <TvMinimalPlay className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-gray-500 text-xl font-medium">No movies found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filter</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                {/* Movie Image with Overlay */}
                <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                  {movie.image ? (
                    <>
                      <img
                        src={`${API_URL}${movie.image}`}
                        alt={movie.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 
                            'https://via.placeholder.com/400x600/4F46E5/FFFFFF?text=No+Image';
                        }}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                      <TvMinimalPlay className="text-blue-300" size={64} />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                        movie.movieStatus === 0
                          ? "bg-green-500/90 text-white"
                          : "bg-amber-500/90 text-white"
                      }`}
                    >
                      {movie.movieStatus === 0 ? "NOW SHOWING" : "COMING SOON"}
                    </span>
                  </div>

                  {/* Rating Badge (decorative) */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1 bg-yellow-400/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                      <Star className="text-yellow-900 fill-yellow-900" size={14} />
                      <span className="text-yellow-900 font-bold text-sm">4.5</span>
                    </div>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {movie.name}
                  </h2>

                  {/* Movie Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="mr-2 text-blue-500" size={18} />
                      <span className="text-sm font-medium">
                        {movie.seatCount} seats available
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <DollarSign className="mr-2 text-green-500" size={18} />
                      <span className="text-sm font-medium">
                        LKR {movie.ticketPrice.toFixed(2)}
                      </span>
                    </div>

                    {movie.showTimes && movie.showTimes.length > 0 && (
                      <div className="flex items-center text-gray-600">
                        <Clock className="mr-2 text-purple-500" size={18} />
                        <span className="text-sm font-medium">
                          {movie.showTimes.length} showtimes
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Book Now Button */}
                  {movie.movieStatus === 0 && movie.seatCount > 0 ? (
                    <button
                      onClick={() => handleBookNowClick(movie)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      Book Tickets
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl bg-gray-300 text-gray-500 font-bold text-base cursor-not-allowed"
                    >
                      Not Available
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Popup - Only show if logged in */}
      {selectedMovie && isLoggedIn() && (
        <BookNowPage
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          movie={selectedMovie}
        />
      )}
    </div>
  );
}