using System.ComponentModel.DataAnnotations;

namespace YourProject.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; } // Alphanumeric Auth0-provided ID

        // Navigation properties
        public virtual ICollection<Board> Boards { get; set; } // Boards owned by this user
    }
}
