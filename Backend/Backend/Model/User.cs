namespace Backend.Model
{
    public class User
    {
        public enum UserRole
        {
            Customer,Admin
        }


        public int Id { get; set; }

        public string Name { get; set; }
        public string email { get; set; }
        public string? phoneNumber { get; set; }
        public string passwordHash { get; set; }
        public string? Image { get; set; }

        public DateTime DateJoined { get; set; } = DateTime.UtcNow;

        public UserRole role { get; set; } = UserRole.Customer;
    }
}
