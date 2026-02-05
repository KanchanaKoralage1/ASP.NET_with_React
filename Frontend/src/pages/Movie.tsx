import React, { useState, useEffect } from "react";
import axios from "axios";
import BookNowPage from "../pages/customer/BookNowPage"; 
import{TvMinimalPlay} from "lucide-react";

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

  //  Search + Filter
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  //  Booking Popup
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);

 
  // Fetch all movies

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://localhost:7267/api/movie/allmovies",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
    // Tab Filter
    if (activeTab === "Showing" && movie.movieStatus !== 0) return false;
    if (activeTab === "ComingSoon" && movie.movieStatus !== 1) return false;

    // Search Filter
    if (!movie.name.toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

  
  // Loading + Empty State

  if (loading) {
    return <p className="text-center mt-10">Loading movies...</p>;
  }

  return (
    <div className="container mx-auto p-6">

      
      {/* Top Section */}
      
      <h1 className="text-3xl font-bold text-center mb-6">
         <TvMinimalPlay className="inline-block mr-2 text-blue-600" size={28} /> Now Showing Movies
      </h1>

      
      {/* Search Bar */}
      
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[400px] border px-4 py-2 rounded-lg shadow-sm"
        />
      </div>

      
      {/* Tabs Section */}
      
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("All")}
          className={`px-5 py-2 rounded-lg font-medium ${
            activeTab === "All"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveTab("Showing")}
          className={`px-5 py-2 rounded-lg font-medium ${
            activeTab === "Showing"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Showing
        </button>

        <button
          onClick={() => setActiveTab("ComingSoon")}
          className={`px-5 py-2 rounded-lg font-medium ${
            activeTab === "ComingSoon"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Coming Soon
        </button>
      </div>

      
      {/* Movie Cards */}
   
      {filteredMovies.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No movies found...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              {/* Movie Image */}
              {movie.image ? (
                <img
                  src={`https://localhost:7267${movie.image}`}
                  alt={movie.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              {/* Movie Info */}
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">
                  {movie.name}
                </h2>

                {/* Status */}
                <p
                  className={`mb-2 font-medium ${
                    movie.movieStatus === 0
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {movie.movieStatus === 0 ? "Showing" : "Coming Soon"}
                </p>

                {/* Seats */}
                <p className="text-gray-600 mb-2">
                  Seats Available: {movie.seatCount}
                </p>

                {/* Price */}
                <p className="text-gray-600 mb-4">
                  Ticket Price: ₹{movie.ticketPrice}
                </p>

                {/* Book Now Button */}
                {movie.movieStatus === 0 && movie.seatCount > 0 ? (
                  <button
                    onClick={() => {
                      setSelectedMovie(movie);
                      setIsBookingOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg font-medium"
                  >
                    Book Your Ticket Now 
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-400 text-white w-full py-2 rounded-lg cursor-not-allowed"
                  >
                    Not Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

     
      {/* Booking Popup */}
      
      {selectedMovie && (
        <BookNowPage
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          movie={selectedMovie}
        />
      )}
    </div>
  );
}
