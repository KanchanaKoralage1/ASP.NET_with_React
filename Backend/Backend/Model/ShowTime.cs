using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Model
{
    public class ShowTime
    {
        public int Id { get; set; }
        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }
        public int MovieId { get; set; }

        [ForeignKey("MovieId")]
        public Movie? Movie { get; set; }

        public List<Booking> Bookings { get; set; } = new();

    }
}
