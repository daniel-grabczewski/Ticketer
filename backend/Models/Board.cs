using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourProject.Models
{
    public class Board
    {
        [Key]
        public string Id { get; set; } // Alphanumeric ID unique to the Board

        [Required]
        public string Name { get; set; } // Name of the board as a string

        [Required]
        public int ColorId { get; set; } // Number ID that is related to a specific HEX code in the color table

        [Required]
        public string UserId { get; set; } // Alphanumeric Auth0-provided ID

        // Navigation properties
        [ForeignKey("ColorId")]
        public virtual Color Color { get; set; } // The color associated with this board

        [ForeignKey("UserId")]
        public virtual User User { get; set; } // The user who owns this board

        public virtual ICollection<List> Lists { get; set; } // The lists in this board
    }
}
