using System.ComponentModel.DataAnnotations;

namespace YourProject.Models
{
    public class Color
    {
        [Key]
        public int Id { get; set; } // Numeric ID unique to the color

        public string Hex { get; set; } // Hex string that represents the color

        // Navigation properties
        public virtual ICollection<Board> Boards { get; set; } // Boards that use this color

        public virtual ICollection<Ticket> Tickets { get; set; } // Tickets that use this color
    }
}
