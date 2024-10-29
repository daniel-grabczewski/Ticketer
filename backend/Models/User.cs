using System.ComponentModel.DataAnnotations;

namespace YourProject.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; } // Alphanumeric Auth0-provided ID

        public string UserName { get; set; } // Alphanumeric Username provided by Auth0

        public bool IsGuest {get; set; } // Boolean value representing whether or not user is a guest

        // Navigation properties
        public virtual ICollection<Board> Boards { get; set; } // Boards owned by this user
    }
}
