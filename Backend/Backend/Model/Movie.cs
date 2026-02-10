namespace Backend.Model
{
    public class Movie
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string? Image { get; set; }

        public MovieStatus movieStatus { get; set; } = MovieStatus.Showing;

        public DateTime addDate { get; set; }

        public decimal TicketPrice { get; set; }

        public List<ShowTime> ShowTimes { get; set; } = new List<ShowTime>();

        public int seatCount{get;set;}
    }

    public enum MovieStatus
    {
        Showing, ComingSoon
    }
}
