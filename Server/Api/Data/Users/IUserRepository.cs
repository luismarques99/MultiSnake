using System.Collections.Generic;
using Server.Api.Dtos.Users;
using Server.Api.Models;

namespace Server.Api.Data.Users
{
    public interface IUserRepository
    {
        bool SaveChanges();
        IEnumerable<User> GetAllUsers();
        User GetUserById(int id);
        void CreateUser(User user);
        void UpdateUser(User user);
        void DeleteUser(User user);
        UserAuthenticateResponseDto Authenticate(UserAuthenticateRequestDto authenticateRequest);
    }
}