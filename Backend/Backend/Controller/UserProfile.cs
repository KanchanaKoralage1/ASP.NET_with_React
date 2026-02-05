using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller
{
    [ApiController]
    [Route("api/userprofile")]
    public class UserProfile:ControllerBase
    {
        private readonly Data.MovieDbContext _db;

        public UserProfile(MovieDbContext db)
        {
            _db = db;
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _db.Users.ToListAsync();
            return Ok(users);
        }
    }
}
