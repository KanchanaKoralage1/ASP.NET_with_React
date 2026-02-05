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

        public  MovieController(MovieDbContext db)
        {
            _db=db;
        }

        //get all movies (both admin, customer)

        [Authorize(Roles ="Admin,Customer")]
        [HttpGet("allmovies")]
        public async Task<IActionResult> getAllMovies()
        {
            var movies = await _db.Movies.Include(m=>m.ShowTimes).ToListAsync();

            return Ok(movies);
        }


        //add movies (only can be done by admin)

        [Authorize(Roles = "Admin")]
        [HttpPost("addmovie")]
        public async Task<IActionResult> AddMovies([FromBody]Movie movie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _db.Movies.Add(movie);
            await _db.SaveChangesAsync();
            return Ok(movie);
        }

        //update part of movies (only for admin)

        [Authorize(Roles ="Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> updateMovie(int id,[FromBody] MovieDto movieDto)
        {
            var movie = await _db.Movies.Include(m => m.ShowTimes).FirstOrDefaultAsync(m => m.Id == id);

            if (movie == null)
            {
                return NotFound();
            }

            movie.Name = movieDto.Name;
            movie.Image = movieDto.Image;
            movie.movieStatus = movieDto.movieStatus;
            movie.addDate = movieDto.addDate;
            movie.seatCount = movieDto.seatCount;
            movie.ShowTimes = movieDto.ShowTimes;

            await _db.SaveChangesAsync();
            return Ok(movie);
        }

        //delete movie (only for admin)

        [Authorize(Roles ="Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> deleteMovie(int id)
        {
            var movie = await _db.Movies.FindAsync(id);

            if(movie == null)
            {
                return NotFound();
            }

            _db.Movies.Remove(movie);
            await _db.SaveChangesAsync();
            return Ok(new {message="Movie deleted successfully"});

        }
    }
}
