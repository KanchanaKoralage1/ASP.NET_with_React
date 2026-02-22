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
        private readonly IWebHostEnvironment _env;

        public UserProfile(MovieDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
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

        public async Task <IActionResult> updateProfile([FromForm] ProfileDto profileDto)
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

            // Handle image upload
            if (profileDto.ImageFile != null && profileDto.ImageFile.Length > 0)
            {
                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(profileDto.ImageFile.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest("Invalid file type. Only JPG, PNG, and GIF are allowed.");
                }

                // Delete old image if exists
                if (!string.IsNullOrEmpty(user.Image))
                {
                    var oldFilePath = Path.Combine(_env.ContentRootPath, "Images", user.Image.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // Create uploads/profile folder if it doesn't exist
                var uploadsFolder = Path.Combine(_env.ContentRootPath, "Images", "uploads", "profile");
                Directory.CreateDirectory(uploadsFolder);

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profileDto.ImageFile.CopyToAsync(stream);
                }

                user.Image = $"Images/uploads/profile/{fileName}";
            }

            await _db.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully", user = user  });
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("changerole/{userId}")]
        public async Task<IActionResult> ChangeUserRole(int userId, [FromBody] ChangeRoleDto roleDto)
        {
            var user = await _db.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Prevent changing your own role
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId != null && int.Parse(currentUserId) == userId)
            {
                return BadRequest("You cannot change your own role");
            }

            // Update role
            user.role = (Model.User.UserRole)roleDto.Role;
            await _db.SaveChangesAsync();

            return Ok(new { message = "User role updated successfully", user = user });
        }

        // ✅ DELETE USER (Admin Only)
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var user = await _db.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Prevent deleting your own account
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId != null && int.Parse(currentUserId) == userId)
            {
                return BadRequest("You cannot delete your own account");
            }

            // Delete user's profile image if exists
            if (!string.IsNullOrEmpty(user.Image))
            {
                var imagePath = Path.Combine(_env.ContentRootPath, "Images", user.Image.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            // Delete related bookings by email (if any)
            var userBookings = await _db.Bookings
                .Where(b => b.CustomerEmail == user.email)
                .ToListAsync();
            
            if (userBookings.Any())
            {
                _db.Bookings.RemoveRange(userBookings);
            }

            // Delete user
            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }
    }
}
