namespace Backend.Model
{
    public class Booking
    {
        public enum PaymentStatus
        {
            Pending = 0,
            Paid = 1,
            Cancelled = 2
        }
        public int Id { get; set; }

        // Movie Relation
        public int MovieId { get; set; }
        public Movie? Movie { get; set; }

        // ShowTime Relation
        public int ShowTimeId { get; set; }
        public ShowTime? ShowTime { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }

        public string CustomerEmail { get; set; }
        public string CustomerName { get; set; }

        public DateTime BookingDate { get; set; } = DateTime.UtcNow;
        public DateTime ShowDate { get; set; }

        public int Seats { get; set; }

        public decimal TotalAmount { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    }
}
