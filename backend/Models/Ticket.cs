namespace backend.Models
{
    public class Ticket
    {
        public int Id { get; set; }  // Primary Key
        public string Title { get; set; }  // Title of the ticket
        public string Description { get; set; }  // Description of the ticket
        public DateTime CreatedAt { get; set; }  // Date the ticket was created
        public DateTime UpdatedAt { get; set; }  // Date the ticket was last updated
    }
}
