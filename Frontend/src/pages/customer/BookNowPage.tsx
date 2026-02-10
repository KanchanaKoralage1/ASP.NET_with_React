import React, { useState } from "react";
import {
  X,
  Ticket,
  CalendarDays,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle,
  CircleDollarSign,
  TvMinimalPlay
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;

  // Movie data passed from Movie.tsx
  movie: any;
}

export default function BookNowPage({ isOpen, onClose, movie }: Props) {
  const [step, setStep] = useState(1);

  // Booking details
  const [selectedDate, setSelectedDate] = useState("");
  const [seats, setSeats] = useState(1);

  // Increase seats
  const increaseSeats = () => {
    if (seats < movie.seatCount) {
      setSeats(seats + 1);
    }
  };

  // Decrease seats
  const decreaseSeats = () => {
    if (seats > 1) {
      setSeats(seats - 1);
    }
  };

  // Total price
  const totalPrice = seats * movie.ticketPrice;

  // Proceed booking
  const handleProceed = () => {
    alert("Booking Confirmed");
    onClose();
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50 ">
      <div className="bg-white w-[450px] rounded-xl shadow-lg overflow-hidden">

        {/* Movie Header  */}
        <div className="relative">

          {/*  Image Wrapper Div */}
          <div className="w-full h-52 overflow-hidden">
            <img
              src={`https://localhost:7267${movie.image}`}
              alt={movie.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-lg"
          >
            <X size={18}/>
          </button>
        </div>

        <div className="p-6">

          {/* Movie Name */}
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            <TvMinimalPlay className="text-blue-600" size={22} /> {movie.name}
          </h2>

         
          {/* STEP 1: Select Date + Seats */}

          {step === 1 && (
            <>
              {/* Select Date */}
              <label className="block font-medium mb-2">
                <CalendarDays className="inline-block mr-2 text-blue-600" size={18} />
                Select Date
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-4"
              />

              {/* Seat Selector */}
              <label className="block font-medium mb-2">
                Select Seats
              </label>

              <div className="flex items-center justify-between border rounded-lg px-4 py-2 mb-6">

                <button
                  onClick={decreaseSeats}
                  className="bg-gray-300 px-3 py-1 rounded-lg text-xl"
                >
                  <Minus size={18} />
                </button>

                <span className="text-lg font-semibold">
                  {seats}
                </span>

                <button
                  onClick={increaseSeats}
                  className="bg-gray-300 px-3 py-1 rounded-lg text-xl"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  disabled={!selectedDate}
                  onClick={() => setStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
                >
                  Next <ArrowRight className="inline-block ml-1" size={18} />
                </button>
              </div>
            </>
          )}

          
          {/* STEP 2: Confirm Booking */}
          
          {step === 2 && (
            <>
              <h3 className="text-xl font-semibold mb-4">
                Confirm Booking Details <CheckCircle className="inline-block ml-2 text-green-600" size={20} />
              </h3>

              <p className="mb-2 text-gray-700">
                <CalendarDays className="inline-block mr-2 text-blue-600" size={18} /> Date:{" "}
                <span className="font-semibold">{selectedDate}</span>
              </p>

              <p className="mb-2 text-gray-700">
                <Ticket className="inline-block mr-2 text-blue-600" size={18} /> Seats:{" "}
                <span className="font-semibold">{seats}</span>
              </p>

              <p className="mb-6 text-gray-700">
                 Total Price:{" "}
                <span className="font-bold text-green-600">
                  <CircleDollarSign className="inline-block mr-2" size={18} />{totalPrice}
                </span>
              </p>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Back
                </button>

                <button
                  onClick={handleProceed}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Proceed ✅
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
