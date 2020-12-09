using Server.Api.Models;

namespace Server.Api.Dtos.Users
{
    public class UserAuthenticateResponseDto : UserReadDto
    {
        public string Token { get; set; }

        public UserAuthenticateResponseDto(User user, string token)
        {
            Id = user.Id;
            Username = user.Username;
            Email = user.Email;
            HighScore = user.HighScore;
            Token = token;
        }
    }
}