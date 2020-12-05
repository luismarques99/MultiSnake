using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Server.Api.Dtos.Users;
using Server.Api.Helpers;
using Server.Api.Helpers.Exceptions;
using Server.Api.Models;
using bCrypt = BCrypt.Net.BCrypt;

namespace Server.Api.Data.Users
{
    public class SqlUserRepository : IUserRepository
    {
        private readonly DatabaseContext _context;
        private readonly AppSettings _appSettings;

        public SqlUserRepository(DatabaseContext context, IOptions<AppSettings> appSettings)
        {
            _context = context;
            _appSettings = appSettings.Value;
        }

        public bool SaveChanges()
        {
            return _context.SaveChanges() > 0;
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public User GetUserById(int id)
        {
            return _context.Users.SingleOrDefault(user => user.Id == id);
        }

        public void CreateUser(User user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));

            var duplicateUsername = _context.Users.SingleOrDefault(other => other.Username.Equals(user.Username));
            if (duplicateUsername != null) throw new DuplicateUserException("Username");

            var duplicateEmail = _context.Users.SingleOrDefault(other => other.Email.Equals(user.Email));
            if (duplicateEmail != null) throw new DuplicateUserException("Email");

            _context.Users.Add(user);
        }

        public void UpdateUser(User user)
        {
            var duplicateUsername = _context.Users.SingleOrDefault(other => other.Username.Equals(user.Username));
            if (duplicateUsername != null && duplicateUsername != user) throw new DuplicateUserException("Username");

            var duplicateEmail = _context.Users.SingleOrDefault(other => other.Email.Equals(user.Email));
            if (duplicateEmail != null && duplicateEmail != user) throw new DuplicateUserException("Email");
        }

        public void DeleteUser(User user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));

            _context.Users.Remove(user);
        }

        public UserAuthenticateResponseDto Authenticate(UserAuthenticateRequestDto authenticateRequest)
        {
            var user = _context.Users.SingleOrDefault(other => other.Username == authenticateRequest.Username);

            if (user == null) return null; // username does not exists

            if (!VerifyPassword(authenticateRequest.Password, user.Password)) return null; // password is wrong

            var token = GenerateJwtToken(user);

            return new UserAuthenticateResponseDto(user, token);
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {new Claim("id", user.Id.ToString())}),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private static bool VerifyPassword(string password, string passwordHash)
        {
            return bCrypt.Verify(password, passwordHash);
        }
    }
}