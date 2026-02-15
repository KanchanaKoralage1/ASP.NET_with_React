namespace Backend.DTO
{
    public class ProfileDto
    {
        public string Name { get; set; }
        public string email { get; set; }
        public string? phoneNumber { get; set; }

        public IFormFile? ImageFile { get; set; }
    }
}
