using System;

namespace Server.Api.Helpers.Exceptions
{
    public class DuplicateUserException : Exception
    {
        public DuplicateUserException(string message) : base(message)
        {
            
        }
    }
}