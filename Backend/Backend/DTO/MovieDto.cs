using Backend.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.DTO
{
    public class MovieDto
    {
        public string Name { get; set; }

        public string? Image { get; set; }
        
        public IFormFile? ImageFile { get; set; }

        public MovieStatus movieStatus { get; set; } = MovieStatus.Showing;

        public DateTime addDate { get; set; }

        public List<ShowTime> ShowTimes { get; set; } = new List<ShowTime>();

        public int seatCount { get; set; }

        public decimal TicketPrice { get; set; }
    }
}
