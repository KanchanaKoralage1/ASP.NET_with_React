using Backend.Data;
using Backend.DTO;
using Backend.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using static Backend.Model.User;

namespace Backend.Controller
{
    [ApiController]
    [Route("api/users")]
    public class UserController:ControllerBase
    {
        private readonly MovieDbContext _db;
        private readonly IConfiguration _configuration;

        public UserController(MovieDbContext db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
        }

        //signup user

        [HttpPost("signup")]
        public async Task<IActionResult> signup([FromBody] UserSignupDto userSignupDto)
        {

            //user available?

            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.email == userSignupDto.email);

            if (existingUser != null)
            {
                return BadRequest("User Already Registerd");
            }

            //before creating user hash the password

            string hashPassword = HashPassword(userSignupDto.passwordHash);

            // new user

            var newUser = new User
            {
                Name = userSignupDto.Name,
                email = userSignupDto.email,
                passwordHash = hashPassword,
                role = UserRole.Customer,
                Image = string.Empty
            };

            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();

            return Ok(new{
                Message = "User Registered successfully",
                UserId = newUser.Id,
            });
        }


        //login user

        [HttpPost("login")]
        public async Task<IActionResult> login([FromBody] UserLoginDto userLoginDto)
        {
            //find user
            var user = await _db.Users.FirstOrDefaultAsync(u => u.email == userLoginDto.email);

            if(user==null)
            {
                return Unauthorized("Invalide Email");
            }
            if(user.passwordHash!=HashPassword(userLoginDto.passwordHash))
            {
                return Unauthorized("Invalid password");
            }

            var token = GenerateToken(user);

            return Ok(new
            {
                Token = token,
                UserId = user.Id,
                Name = user.Name,
                role = user.role.ToString()
            });

        }

        public string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            byte[] bytes = Encoding.UTF8.GetBytes(password);
            byte[] hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);

        }

        public string GenerateToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];
            var expiryInMinutes = int.Parse(jwtSettings["ExpiryInMinutes"]);

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryInMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}


