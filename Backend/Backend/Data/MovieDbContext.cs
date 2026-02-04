using Backend.Model;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class MovieDbContext:DbContext
    {
        public MovieDbContext(DbContextOptions<MovieDbContext>options):base(options)
        {

        }

        public DbSet<User> Users { get; set; }
    }
}
