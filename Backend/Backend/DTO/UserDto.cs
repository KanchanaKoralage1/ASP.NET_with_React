namespace Backend.DTO
{
    public class UserSignupDto
    {
        public string Name { get; set; }
        public string email{get;set;}

        public string passwordHash { get; set; }
    }

    public class UserLoginDto
    {
        public string email { get; set; }
        public string passwordHash { get; set; }
    }
}
