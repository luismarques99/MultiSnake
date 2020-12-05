using System.ComponentModel.DataAnnotations;

namespace Server.Api.Dtos.Users
{
    public class UserCreateDto
    {
        [Required]
        public string Username { get; set; }
        
        [Required]
        public string Email { get; set; }
        
        [Required]
        public string Password { get; set; }
    }
}