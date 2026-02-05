using Backend.Data;
using Backend.DTO;
using Backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

            movie.seatCount -= dto.Seats;

            var booking = new Booking
            {
                MovieId = dto.MovieId,
                ShowTimeId = dto.ShowTimeId,
                Seats = dto.Seats,
                CustomerEmail = User.Identity.Name, // take from token
                Date = DateTime.Now
            };

            _db.Bookings.Add(booking);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Booking successful",
                bookingId = booking.Id
            });
        }

        //view booking 

        [Authorize(Roles = "Admin,Customer")]
        [HttpGet("mybookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var email = User.Identity.Name; // Assuming you store email in token
            var bookings = await _db.Bookings
                .Include(b => b.Movie)
                .Where(b => b.CustomerEmail == email)
                .ToListAsync();
            return Ok(bookings);
        }
    }
}
