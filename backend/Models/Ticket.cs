using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourProject.Models
{
    public class Ticket
    {
        [Key]
        public string Id { get; set; } // Alphanumeric ID unique to the ticket

        [Required]
        public string Name { get; set; } // Name of the ticket as a string

        [Required]
        public string ListId { get; set; } // Alphanumeric ID related to a List in the board

        public string Description { get; set; } // Description of the ticket as a string

        public int? ColorId { get; set; }

        [Required]
        public int Position { get; set; } // Number representing the order of the tickets in their list

        // Navigation properties
        [ForeignKey("ListId")]
        public virtual List List { get; set; } // The list this ticket belongs to

        [ForeignKey("ColorId")]
        public virtual Color Color { get; set; } // The color associated with this ticket
    }
}
