using Microsoft.EntityFrameworkCore;
using YourProject.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets for each entity
        public DbSet<Board> Boards { get; set; }
        public DbSet<List> Lists { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<User> Users { get; set; }

        // Override OnModelCreating to configure relationships and other settings
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure default value for Ticket.ColorId
            modelBuilder.Entity<Ticket>()
                .Property(t => t.ColorId)
                .HasDefaultValue(0);

            // Configure relationships

            // User has many Boards
            modelBuilder.Entity<User>()
                .HasMany(u => u.Boards)
                .WithOne(b => b.User)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Board has many Lists
            modelBuilder.Entity<Board>()
                .HasMany(b => b.Lists)
                .WithOne(l => l.Board)
                .HasForeignKey(l => l.BoardId)
                .OnDelete(DeleteBehavior.Cascade);

            // Board has one Color
            modelBuilder.Entity<Board>()
                .HasOne(b => b.Color)
                .WithMany(c => c.Boards)
                .HasForeignKey(b => b.ColorId)
                .OnDelete(DeleteBehavior.Restrict);

            // List has many Tickets
            modelBuilder.Entity<List>()
                .HasMany(l => l.Tickets)
                .WithOne(t => t.List)
                .HasForeignKey(t => t.ListId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ticket has one Color
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Color)
                .WithMany(c => c.Tickets)
                .HasForeignKey(t => t.ColorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure string properties (optional)
            modelBuilder.Entity<Color>()
                .Property(c => c.Hex)
                .IsRequired()
                .HasMaxLength(7); // E.g., "#FFFFFF"

            modelBuilder.Entity<User>()
                .Property(u => u.Id)
                .IsRequired()
                .HasMaxLength(255); // Adjust based on Auth0 ID length

            modelBuilder.Entity<Board>()
                .Property(b => b.Name)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<List>()
                .Property(l => l.Name)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Ticket>()
                .Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Ticket>()
                .Property(t => t.Description)
                .HasMaxLength(1000);
        }
    }
}
