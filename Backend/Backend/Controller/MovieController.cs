using Backend.Data;
using Backend.DTO;
using Backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller
{

    [ApiController]
    [Route("api/movie")]
    public class MovieController:ControllerBase
    {
        private readonly MovieDbContext _db;
        private readonly IWebHostEnvironment _env;

        public  MovieController(MovieDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        //get all movies (both admin, customer)

        //[Authorize(Roles ="Admin,Customer")]
        [AllowAnonymous]
        [HttpGet("allmovies")]
        public async Task<IActionResult> getAllMovies()
        {
            var movies = await _db.Movies.Include(m=>m.ShowTimes).ToListAsync();

            return Ok(movies);
        }


        //add movies (only can be done by admin)

        [Authorize(Roles = "Admin")]
        [HttpPost("addmovie")]
        public async Task<IActionResult> AddMovies([FromForm] MovieDto movieDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string? imagePath = null;

            // Handle image upload
            if (movieDto.ImageFile != null && movieDto.ImageFile.Length > 0)
            {
                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(movieDto.ImageFile.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest("Invalid file type. Only JPG, PNG, and GIF are allowed.");
                }

                // Create uploads folder if it doesn't exist
                var uploadsFolder = Path.Combine(_env.ContentRootPath, "images", "uploads", "movies");
                Directory.CreateDirectory(uploadsFolder);

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await movieDto.ImageFile.CopyToAsync(stream);
                }

                imagePath = $"/images/uploads/movies/{fileName}";
            }

            var movie = new Movie
            {
                Name = movieDto.Name,
                Image = imagePath,
                movieStatus = movieDto.movieStatus,
                addDate = movieDto.addDate,
                TicketPrice = movieDto.TicketPrice,
                seatCount = movieDto.seatCount,
                ShowTimes = movieDto.ShowTimes
            };

            _db.Movies.Add(movie);
            await _db.SaveChangesAsync();
            return Ok(movie);
        }

        //update part of movies (only for admin)

        [Authorize(Roles ="Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> updateMovie(int id, [FromForm] MovieDto movieDto)
        {
            var movie = await _db.Movies.Include(m => m.ShowTimes).FirstOrDefaultAsync(m => m.Id == id);

            if (movie == null)
            {
                return NotFound();
            }

            movie.Name = movieDto.Name;
            movie.movieStatus = movieDto.movieStatus;
            movie.addDate = movieDto.addDate;
            movie.seatCount = movieDto.seatCount;
            movie.TicketPrice = movieDto.TicketPrice;

            // Handle image upload if a new file is provided
            if (movieDto.ImageFile != null && movieDto.ImageFile.Length > 0)
            {
                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(movieDto.ImageFile.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest("Invalid file type. Only JPG, PNG, and GIF are allowed.");
                }

                // Delete old image file if it exists
                if (!string.IsNullOrEmpty(movie.Image))
                {
                    var oldFilePath = Path.Combine(_env.ContentRootPath, "images", movie.Image.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // Create uploads folder if it doesn't exist
                var uploadsFolder = Path.Combine(_env.ContentRootPath, "images", "uploads", "movies");
                Directory.CreateDirectory(uploadsFolder);

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await movieDto.ImageFile.CopyToAsync(stream);
                }

                movie.Image = $"/images/uploads/movies/{fileName}";
            }
            else if (!string.IsNullOrEmpty(movieDto.Image))
            {
                // Keep existing image path if provided and no new file uploaded
                movie.Image = movieDto.Image;
            }

            _db.ShowTimes.RemoveRange(movie.ShowTimes);

            // ✅ Add new showtimes
            movie.ShowTimes = movieDto.ShowTimes.Select(st => new ShowTime
            {
                startTime = st.startTime,
                endTime = st.endTime,
                MovieId = movie.Id
            }).ToList();

            await _db.SaveChangesAsync();
            return Ok(movie);
        }

        //delete movie (only for admin)

        [Authorize(Roles ="Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> deleteMovie(int id)
        {
            var movie = await _db.Movies
                .Include(m => m.ShowTimes)
                .ThenInclude(st => st.Bookings)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (movie == null)
            {
                return NotFound();
            }

            // Delete associated image file if it exists
            if (!string.IsNullOrEmpty(movie.Image))
            {
                var imagePath = Path.Combine(_env.ContentRootPath, "images", movie.Image.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            // Delete all bookings for all showtimes
            foreach (var showTime in movie.ShowTimes)
            {
                _db.Bookings.RemoveRange(showTime.Bookings);
            }

            // Delete all showtimes
            _db.ShowTimes.RemoveRange(movie.ShowTimes);

            // Delete the movie
            _db.Movies.Remove(movie);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Movie deleted successfully" });
        }

        
    }
}
