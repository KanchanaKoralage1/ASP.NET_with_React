import React, { useState } from "react";
import axios from "axios";
import {
  X,
  Ticket,
  CalendarDays,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle,
  CircleDollarSign,
  TvMinimalPlay,
  Users,
  CreditCard,
  Clock
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  movie: any;
}

export default function BookNowPage({ isOpen, onClose, movie }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  //const API_URL = (import.meta.env.VITE_API_URL ?? "") as string;
  const API_URL = import.meta.env.VITE_API_URL || "http://20.212.19.81:5000";

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [seats, setSeats] = useState(1);

  const increaseSeats = () => {
    if (seats < movie.seatCount) {
      setSeats(seats + 1);
    }
  };

  const decreaseSeats = () => {
    if (seats > 1) {
      setSeats(seats - 1);
    }
  };

  const totalPrice = seats * movie.ticketPrice;

  const handleConfirmBooking = async () => {
    if (!selectedShowtime) {
      alert("Please select a showtime");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${API_URL}/api/booking/create`,
        {
          movieId: movie.id,
          showTimeId: parseInt(selectedShowtime),
          seats: seats,
          showDate: selectedDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert(`${response.data.message}\nBooking ID: ${response.data.bookingId}\nTotal: LKR ${response.data.totalAmount}`);
      handleClose();
      
      // Redirect to bookings page
      window.location.href = "/customer/bookings";
    } catch (error: any) {
      console.error("Booking error:", error);
      alert(error.response?.data || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSeats(1);
    setSelectedDate("");
    setSelectedShowtime("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Movie Header */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={`${API_URL}${movie.image}`}
            alt={movie.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 
                'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Movie+Poster';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              <TvMinimalPlay size={20} />
              {movie.name}
            </h2>
            <p className="text-sm text-gray-200 flex items-center gap-1">
              <Users size={14} />
              {movie.seatCount} seats • LKR {movie.ticketPrice.toFixed(2)}/ticket
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step >= 1 ? "bg-blue-600 text-white scale-110" : "bg-gray-300 text-gray-600"
            }`}>
              1
            </div>
            <span className="text-sm font-medium text-gray-700">Select</span>
          </div>
          
          <div className={`w-16 h-0.5 transition-all ${step >= 2 ? "bg-blue-600" : "bg-gray-300"}`}></div>
          
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step >= 2 ? "bg-blue-600 text-white scale-110" : "bg-gray-300 text-gray-600"
            }`}>
              2
            </div>
            <span className="text-sm font-medium text-gray-700">Confirm</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Date Selection */}
              <div>
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2 text-sm">
                  <CalendarDays className="text-blue-600" size={18} />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                />
              </div>

              {/* Showtime Selection */}
              {movie.showTimes && movie.showTimes.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2 text-sm">
                    <Clock className="text-blue-600" size={18} />
                    Select Showtime
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {movie.showTimes.map((showtime: any) => (
                      <button
                        key={showtime.id}
                        onClick={() => setSelectedShowtime(showtime.id.toString())}
                        className={`p-3 rounded-lg border-2 font-medium transition-all ${
                          selectedShowtime === showtime.id.toString()
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {new Date(showtime.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seat Selection */}
              <div>
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2 text-sm">
                  <Ticket className="text-blue-600" size={18} />
                  Number of Seats
                </label>
                
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={decreaseSeats}
                      disabled={seats <= 1}
                      className="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all"
                    >
                      <Minus size={18} />
                    </button>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{seats}</div>
                      <div className="text-xs text-gray-600">{seats === 1 ? "Seat" : "Seats"}</div>
                    </div>

                    <button
                      onClick={increaseSeats}
                      disabled={seats >= movie.seatCount}
                      className="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Preview */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-gray-700 font-medium text-sm">Total Amount</span>
                <div className="flex items-center gap-1">
                  <CircleDollarSign className="text-green-600" size={20} />
                  <span className="text-xl font-bold text-green-600">LKR {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!selectedDate || !selectedShowtime}
                  onClick={() => setStep(2)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2.5 rounded-lg font-semibold disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIRMATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Confirm Booking</h3>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border-2 border-gray-200">
                <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                  <span className="text-sm text-gray-600">Movie</span>
                  <span className="font-semibold text-gray-800">{movie.name}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays size={16} />
                    Date
                  </div>
                  <span className="font-semibold text-gray-800">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    Showtime
                  </div>
                  <span className="font-semibold text-gray-800">
                    {movie.showTimes.find((st: any) => st.id.toString() === selectedShowtime)
                      ? new Date(movie.showTimes.find((st: any) => st.id.toString() === selectedShowtime).startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Ticket size={16} />
                    Seats
                  </div>
                  <span className="font-semibold text-gray-800">{seats} × LKR {movie.ticketPrice.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                  <div className="flex items-center gap-1">
                    <CircleDollarSign className="text-green-600" size={20} />
                    <span className="text-xl font-bold text-green-600">LKR {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}