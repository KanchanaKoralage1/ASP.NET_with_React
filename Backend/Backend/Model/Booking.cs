namespace Backend.Model
{
    public class Booking
    {
        public int Id { get; set; }

        // Movie Relation
        public int MovieId { get; set; }
        public Movie? Movie { get; set; }

        // ShowTime Relation
        public int ShowTimeId { get; set; }
        public ShowTime? ShowTime { get; set; }

        public string CustomerEmail { get; set; }

        public DateTime Date { get; set; } // Booking Date

        public int Seats { get; set; }

    }
}
