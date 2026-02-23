namespace Backend.DTO
{
    public class BookingDto
    {
        public int MovieId { get; set; }
        public int ShowTimeId { get; set; }
        public int Seats { get; set; }
        public DateTime ShowDate { get; set; }
    }

    public class PaymentStatusDto
    {
        public int Status { get; set; } // 0 = Pending, 1 = Paid, 2 = Cancelled
    }
}
