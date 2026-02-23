import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Ticket,
  User,
  Mail,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Film,
  Clock,
} from "lucide-react";

interface Booking {
  id: number;
  movie: {
    name: string;
    image: string;
  };
  showTime: {
    startTime: string;
  };
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  showDate: string;
  seats: number;
  totalAmount: number;
  status: number;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  //const API_URL = (import.meta.env.VITE_API_URL ?? "") as string;
  const API_URL = import.meta.env.VITE_API_URL || "http://20.212.19.81:5000";

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/booking/all`, {
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

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
            <AlertCircle size={14} />
            Pending
          </span>
        );
      case 1:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            <CheckCircle2 size={14} />
            Paid
          </span>
        );
      case 2:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
            <XCircle size={14} />
            Cancelled
          </span>
        );
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === parseInt(filter);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Ticket className="text-blue-600" size={40} />
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  All Bookings
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage all customer bookings
                </p>
              </div>
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Bookings</option>
              <option value="0">Pending</option>
              <option value="1">Paid</option>
              <option value="2">Cancelled</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl shadow-md">
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-800">
                {bookings.length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {bookings.filter((b) => b.status === 0).length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md">
              <p className="text-gray-600 text-sm">Paid</p>
              <p className="text-3xl font-bold text-green-600">
                {bookings.filter((b) => b.status === 1).length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md">
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-3xl font-bold text-blue-600">
                LKR{" "}
                {bookings
                  .filter((b) => b.status === 1)
                  .reduce((sum, b) => sum + b.totalAmount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="p-4 text-left font-semibold">ID</th>
                  <th className="p-4 text-left font-semibold">Customer</th>
                  <th className="p-4 text-left font-semibold">Movie</th>
                  <th className="p-4 text-left font-semibold">Show Date</th>
                  <th className="p-4 text-left font-semibold">Time</th>
                  <th className="p-4 text-left font-semibold">Seats</th>
                  <th className="p-4 text-left font-semibold">Amount</th>
                  <th className="p-4 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-700">
                      #{booking.id}
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="flex items-center gap-2 font-medium text-gray-800">
                          <User size={16} />
                          {booking.customerName}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Mail size={14} />
                          {booking.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {booking.movie.name}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(booking.showDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(booking.showTime.startTime).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {booking.seats}
                    </td>
                    <td className="p-4 font-bold text-green-600">
                      LKR {booking.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      {getStatusBadge(booking.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Ticket className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No bookings found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}