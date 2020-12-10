using Microsoft.EntityFrameworkCore;
using Server.Api.Models;

namespace Server.Api.Data
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
    }
}