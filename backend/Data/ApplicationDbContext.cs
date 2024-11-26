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
                .Property(c => c.HexCode)
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
                .HasMaxLength(10000);

                            modelBuilder.Entity<User>().HasData(
    new User { Id = "google-oauth2|116927637409288985519", UserName = "User", IsGuest = false }
);

            // Seed data for Colors
            modelBuilder.Entity<Color>().HasData(
                new Color { Id = 1, HexCode = "#50C996" },
                new Color { Id = 2, HexCode = "#3BBA3B" },
                new Color { Id = 3, HexCode = "#8131F9" },
                new Color { Id = 4, HexCode = "#FEA362" },
                new Color { Id = 5, HexCode = "#F773BE" },
                new Color { Id = 6, HexCode = "#EE4646" }
            );

          modelBuilder.Entity<Board>().HasData(
            new Board { Id = "test-id-123",
            Name = "test marketing board", ColorId = 1, UserId = "google-oauth2|116927637409288985519", CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
             }
          );

              modelBuilder.Entity<List>().HasData(
                new List { Id = "list-1", Name = "To Do", BoardId = "test-id-123", Position = 1 },
                new List { Id = "list-2", Name = "In Progress", BoardId = "test-id-123", Position = 2 },
                new List { Id = "list-3", Name = "Review", BoardId = "test-id-123", Position = 3 },
                new List { Id = "list-4", Name = "Completed", BoardId = "test-id-123", Position = 4 }
            );

            // Seed Ticket Data for each List
            modelBuilder.Entity<Ticket>().HasData(
                // Tickets for "To Do" list
                new Ticket { Id = "ticket-1", Name = "Create Marketing Plan", ListId = "list-1", Description = "Outline key strategies.", ColorId = 2, Position = 1 },
                new Ticket { Id = "ticket-2", Name = "Research Competitors", ListId = "list-1", Description = "Gather competitive insights.", ColorId = 3, Position = 2 },

                // Tickets for "In Progress" list
                new Ticket { Id = "ticket-3", Name = "Social Media Campaign", ListId = "list-2", Description = "Draft posts for Q1.", ColorId = 4, Position = 1 },
                new Ticket { Id = "ticket-4", Name = "Design Landing Page", ListId = "list-2", Description = "Initial design concept.", ColorId = 5, Position = 2 },
                new Ticket { Id = "ticket-5", Name = "Write Blog Posts", ListId = "list-2", Description = "SEO-focused articles.", ColorId = 6, Position = 3 },

                // Tickets for "Review" list
                new Ticket { Id = "ticket-6", Name = "Budget Approval", ListId = "list-3", Description = "Get approval from finance.", ColorId = 2, Position = 1 },
                new Ticket { Id = "ticket-7", Name = "Draft Newsletter", ListId = "list-3", Description = "Prepare Q1 newsletter.", ColorId = 4, Position = 2 },

                // Tickets for "Completed" list
                new Ticket { Id = "ticket-8", Name = "Set Up Analytics", ListId = "list-4", Description = "Google Analytics setup.", ColorId = 1, Position = 1 },
                new Ticket { Id = "ticket-9", Name = "Team Meeting", ListId = "list-4", Description = "Discuss goals and milestones.", ColorId = 2, Position = 2 },
                new Ticket { Id = "ticket-10", Name = "Launch Survey", ListId = "list-4", Description = "Send out to subscribers.", ColorId = 4, Position = 3 }
            );
        }
    }
}
