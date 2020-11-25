using System.ComponentModel.DataAnnotations;

namespace Server.Api.Dtos.Users
{
    public class UserAuthenticateRequestDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}