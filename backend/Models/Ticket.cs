namespace backend.Models
{
public class Ticket
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? UserId { get; set; } // Auth0 ID or guest ID
    public bool IsGuest { get; set; }    // To distinguish between guest and Auth0 users
}

public class UpdateTicketDto {
    public required string Title { get; set; }
    public required string Description { get; set; }
    public DateTime UpdatedAt { get; set; }
}
}
