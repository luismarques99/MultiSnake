using System.Collections.Generic;
using System.Text.RegularExpressions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Server.Api.Data.Users;
using Server.Api.Dtos.Users;
using Server.Api.Helpers.Exceptions;
using Server.Api.Models;
using bCrypt = BCrypt.Net.BCrypt;

namespace Server.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET api/users
        [Authorize]
        [HttpGet]
        public ActionResult<IEnumerable<UserReadDto>> GetAllUsers()
        {
            var users = _repository.GetAllUsers();

            if (users == null) return NotFound();

            return Ok(_mapper.Map<IEnumerable<UserReadDto>>(users));
        }
        
        // GET api/users/{id}
        [Authorize]
        [HttpGet("{id}", Name = "GetUserById")]
        public ActionResult<UserReadDto> GetUserById(int id)
        {
            var user = _repository.GetUserById(id);

            if (user == null) return NotFound();

            return Ok(_mapper.Map<UserReadDto>(user));
        }

        // POST api/users
        [HttpPost]
        public ActionResult<UserReadDto> CreateUser(UserCreateDto userCreateDto)
        {
            if (userCreateDto == null) return NoContent();

            userCreateDto.Username = Regex.Replace(userCreateDto.Username, @" ", "");
            userCreateDto.Password = HashPassword(userCreateDto.Password);

            var user = _mapper.Map<User>(userCreateDto);

            try
            {
                _repository.CreateUser(user);
            }
            catch (DuplicateUserException e)
            {
                var message = e.Message;
                return BadRequest(new {message = $"{message} is already in use"});
            }

            _repository.SaveChanges();

            var userReadDto = _mapper.Map<UserReadDto>(user);

            return CreatedAtRoute(nameof(GetUserById), new {userReadDto.Id}, userReadDto);
        }

        // PUT api/users/{id}
        [HttpPut("{id}")]
        public ActionResult UpdateUser(int id, UserUpdateDto userUpdateDto)
        {
            var user = _repository.GetUserById(id);

            if (user == null) return NotFound();

            userUpdateDto.Username = Regex.Replace(userUpdateDto.Username, @" ", "");

            _mapper.Map(userUpdateDto, user);

            try
            {
                _repository.UpdateUser(user);
            }
            catch (DuplicateUserException e)
            {
                var message = e.Message;
                return BadRequest(new {message = $"{message} is already in use"});
            }

            _repository.SaveChanges();

            return NoContent();
        }

        // PATCH api/users/{id}
        [HttpPatch("{id}")]
        public ActionResult PartialUpdateUser(int id, JsonPatchDocument<UserCreateDto> jsonPatchDocument)
        {
            var user = _repository.GetUserById(id);

            if (user == null) return NotFound();

            var userCreateDto = _mapper.Map<UserCreateDto>(user);

            jsonPatchDocument.ApplyTo(userCreateDto, ModelState);
            if (!TryValidateModel(userCreateDto)) return ValidationProblem(ModelState);

            if (userCreateDto.Password != user.Password)
                userCreateDto.Password = VerifyPassword(userCreateDto.Password, user.Password)
                    ? user.Password
                    : HashPassword(userCreateDto.Password);

            userCreateDto.Username = Regex.Replace(userCreateDto.Username, @" ", "");

            _mapper.Map(userCreateDto, user);

            try
            {
                _repository.UpdateUser(user);
            }
            catch (DuplicateUserException e)
            {
                var message = e.Message;
                return BadRequest(new {message = $"{message} is already in use"});
            }

            _repository.SaveChanges();

            return NoContent();
        }

        // DELETE api/users/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteUser(int id)
        {
            var user = _repository.GetUserById(id);

            if (user == null) return NotFound();

            _repository.DeleteUser(user);
            _repository.SaveChanges();

            return NoContent();
        }

        // POST api/users/authenticate
        [HttpPost("authenticate")]
        public ActionResult<UserAuthenticateResponseDto> Authenticate(UserAuthenticateRequestDto authenticateRequest)
        {
            var authenticateResponse = _repository.Authenticate(authenticateRequest);

            if (authenticateResponse == null) return BadRequest(new {message = "Username or password is incorrect"});

            return Ok(authenticateResponse);
        }

        private static string HashPassword(string password)
        {
            return password == null ? "" : bCrypt.HashPassword(password);
        }

        private static bool VerifyPassword(string password, string passwordHash)
        {
            return bCrypt.Verify(password, passwordHash);
        }
    }
}