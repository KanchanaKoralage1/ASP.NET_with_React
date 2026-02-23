using Backend.Data;
using Backend.DTO;
using Backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controller
{
    [ApiController]
    [Route("api/booking")]
    public class BookingController:ControllerBase
    {
        private readonly MovieDbContext _db;

        public BookingController(MovieDbContext db)
        {
            _db = db;
        }

        //create booking 

        [Authorize(Roles="Admin,Customer")]
        [HttpPost("create")]
        public async Task<IActionResult> BookMovie([FromBody] BookingDto dto)
        {
            var movie = await _db.Movies.FindAsync(dto.MovieId);
            if (movie == null) return NotFound("Movie not found");

            var showtime = await _db.ShowTimes.FindAsync(dto.ShowTimeId);
            if (showtime == null) return NotFound("ShowTime not found");

            if (dto.Seats > movie.seatCount)
                return BadRequest("Not enough seats available");

            // Get user info from token
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.FindFirstValue(ClaimTypes.Name);
            var userEmail = User.FindFirstValue(ClaimTypes.Email);

             // Calculate total amount
            var totalAmount = dto.Seats * movie.TicketPrice;

            // Reduce available seats
            movie.seatCount -= dto.Seats;

            var booking = new Booking
            {
                MovieId = dto.MovieId,
                ShowTimeId = dto.ShowTimeId,
                UserId = userId != null ? int.Parse(userId) : null,
                CustomerName = userName ?? "Guest",
                CustomerEmail = userEmail ?? "unknown@example.com",
                Seats = dto.Seats,
                ShowDate = dto.ShowDate,
                TotalAmount = totalAmount,
                BookingDate = DateTime.UtcNow,
                Status = Booking.PaymentStatus.Pending
            };

            _db.Bookings.Add(booking);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Booking successful",
                bookingId = booking.Id,
                totalAmount = totalAmount,
                status = "Pending"
            });
        }

        //view booking 

        [Authorize(Roles = "Admin,Customer")]
        [HttpGet("mybookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var bookings = await _db.Bookings
                .Include(b => b.Movie)
                .Include(b => b.ShowTime)
                .Where(b => b.CustomerEmail == userEmail)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();
            return Ok(bookings);
        }

         // GET ALL BOOKINGS (Admin)
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _db.Bookings
                .Include(b => b.Movie)
                .Include(b => b.ShowTime)
                .Include(b => b.User)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();

            return Ok(bookings);
        }

        // UPDATE PAYMENT STATUS
        [Authorize(Roles = "Admin,Customer")]
        [HttpPut("payment/{bookingId}")]
        public async Task<IActionResult> UpdatePaymentStatus(int bookingId, [FromBody] PaymentStatusDto dto)
        {
            var booking = await _db.Bookings.FindAsync(bookingId);
            if (booking == null) return NotFound("Booking not found");

            // Customers can only update their own bookings
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole != "Admin" && booking.CustomerEmail != userEmail)
            {
                return Forbid();
            }

            booking.Status = (Booking.PaymentStatus)dto.Status;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Payment status updated", booking });
        }

        // CANCEL BOOKING
        [Authorize(Roles = "Admin,Customer")]
        [HttpDelete("cancel/{bookingId}")]
        public async Task<IActionResult> CancelBooking(int bookingId)
        {
            var booking = await _db.Bookings
                .Include(b => b.Movie)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null) return NotFound("Booking not found");

            // Customers can only cancel their own bookings
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole != "Admin" && booking.CustomerEmail != userEmail)
            {
                return Forbid();
            }

            // Restore seats
            if (booking.Movie != null)
            {
                booking.Movie.seatCount += booking.Seats;
            }

            booking.Status = Booking.PaymentStatus.Cancelled;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Booking cancelled successfully" });
        }

    }
}
