import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Ticket,
  DollarSign,
  Clock,
  Film,
  CreditCard,
  XCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Booking {
  id: number;
  movieId: number;
  movie: {
    id: number;
    name: string;
    image: string;
    ticketPrice: number;
  };
  showTime: {
    id: number;
    startTime: string;
    endTime: string;
  };
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  showDate: string;
  seats: number;
  totalAmount: number;
  status: number; // 0 = Pending, 1 = Paid, 2 = Cancelled
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = (import.meta.env.VITE_API_URL ?? "") as string;

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/booking/mybookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/booking/payment/${bookingId}`,
        { status: 1 }, // 1 = Paid
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      alert("Payment successful!");
      fetchBookings();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed");
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/booking/cancel/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
            <AlertCircle size={16} />
            Pending
          </span>
        );
      case 1:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            <CheckCircle2 size={16} />
            Paid
          </span>
        );
      case 2:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
            <XCircle size={16} />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Ticket className="text-blue-600" size={36} />
            <h1 className="text-4xl font-bold text-gray-800">My Bookings</h1>
          </div>
          <p className="text-gray-600">View and manage your movie bookings</p>
        </div>

        {/* Bookings Grid */}
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Movie Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                  {booking.movie.image ? (
                    <img
                      src={`${API_URL}${booking.movie.image}`}
                      alt={booking.movie.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Movie";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="text-gray-400" size={64} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Booking Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {booking.movie.name}
                  </h3>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="mr-2 text-blue-500" size={18} />
                      <span className="text-sm">
                        {new Date(booking.showDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Clock className="mr-2 text-purple-500" size={18} />
                      <span className="text-sm">
                        {new Date(
                          booking.showTime.startTime,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Ticket className="mr-2 text-green-500" size={18} />
                      <span className="text-sm font-medium">
                        {booking.seats} {booking.seats === 1 ? "Seat" : "Seats"}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <DollarSign className="mr-2 text-orange-500" size={18} />
                      <span className="text-sm font-bold">
                        LKR {booking.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {booking.status === 0 && (
                      <>
                        <button
                          onClick={() => handlePayment(booking.id)}
                          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold shadow-md transition-all"
                        >
                          <CreditCard size={18} />
                          Pay Now
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold shadow-md transition-all"
                        >
                          <XCircle size={18} />
                          Cancel Booking
                        </button>
                      </>
                    )}

                    {booking.status === 1 && (
                      <div className="text-center py-3 bg-green-50 rounded-xl border-2 border-green-200">
                        <p className="text-green-700 font-semibold flex items-center justify-center gap-2">
                          <CheckCircle2 size={20} />
                          Payment Completed
                        </p>
                      </div>
                    )}

                    {booking.status === 2 && (
                      <div className="text-center py-3 bg-red-50 rounded-xl border-2 border-red-200">
                        <p className="text-red-700 font-semibold">Cancelled</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <Ticket className="mx-auto text-gray-400 mb-4" size={80} />
            <p className="text-gray-500 text-xl font-medium mb-2">
              No bookings yet
            </p>
            <p className="text-gray-400 mb-6">
              Start booking your favorite movies!
            </p>

            <a
              href="/movies"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              Browse Movies
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
