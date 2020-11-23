using AutoMapper;
using Server.Api.Dtos.Users;
using Server.Api.Models;

namespace Server.Api.Profiles
{
    public class UsersProfile : Profile
    {
        public UsersProfile()
        {
            CreateMap<User, UserReadDto>();
            CreateMap<UserCreateDto, User>();
            CreateMap<User, UserCreateDto>();
            CreateMap<UserUpdateDto, User>();
        }
    }
}