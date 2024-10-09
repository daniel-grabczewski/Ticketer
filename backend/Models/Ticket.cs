namespace backend.Models
{
public class Ticket
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UpdateTicketDto {
    public required string Title { get; set; }
    public required string Description { get; set; }
    public DateTime UpdatedAt { get; set; }
}
}
