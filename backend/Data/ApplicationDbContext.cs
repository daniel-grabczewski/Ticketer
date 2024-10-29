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

            // Board has optional Color
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

            // Ticket has optional Color
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

            // Seed data for Colors
            modelBuilder.Entity<Color>().HasData(
                new Color { Id = 1, Hex = "#50C996" },
                new Color { Id = 2, Hex = "#3BBA3B" },
                new Color { Id = 4, Hex = "#8131F9" },
                new Color { Id = 5, Hex = "#FEA362" },
                new Color { Id = 6, Hex = "#F773BE" },
                new Color { Id = 7, Hex = "#EE4646" }
            );
        }
    }
}
