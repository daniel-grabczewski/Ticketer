using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourProject.Models
{
    public class List
    {
        [Key]
        public string Id { get; set; } // Alphanumeric ID unique to the List

        [Required]
        public string Name { get; set; } // Name of the list as a string

        [Required]
        public string BoardId { get; set; } // Alphanumeric ID related to a board

        [Required]
        public int Position { get; set; } // Number representing the order of lists

        // Navigation properties
        [ForeignKey("BoardId")]
        public virtual Board Board { get; set; } // The board this list belongs to

        public virtual ICollection<Ticket> Tickets { get; set; } // The tickets in this list
    }
}
