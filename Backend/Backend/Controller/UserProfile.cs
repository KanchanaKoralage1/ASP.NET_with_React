using Backend.Data;
using Backend.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _db.Users.FindAsync(int.Parse(userId));

            if (user == null)
            {
                return NotFound("User Not found");
            }
            else
            {
                return Ok(user);
            }
        }

        [Authorize]
        [HttpPut("edituser")]

        public async Task <IActionResult> updateProfile([FromBody] ProfileDto profileDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(userId == null)
            {
                return Unauthorized();
            }

            var user = await _db.Users.FindAsync(int.Parse(userId));

            if(user == null)
            {
                return NotFound("User Not found");
            }

            user.Name = profileDto.Name;
            user.email = profileDto.email;
            user.phoneNumber = profileDto.phoneNumber;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully" });
        }
    }
}
