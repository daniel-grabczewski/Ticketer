using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSet for Ticket entity
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<User> Users { get; set; }
        // You can add other DbSets for more entities here
    }
}