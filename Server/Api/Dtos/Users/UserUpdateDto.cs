using System.ComponentModel.DataAnnotations;

namespace Server.Api.Dtos.Users
{
    public class UserUpdateDto
    {
        [Required]
        public string Username { get; set; }
        
        [Required]
        public string Email { get; set; }
    }
}