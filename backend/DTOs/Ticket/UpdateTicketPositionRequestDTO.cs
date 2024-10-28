namespace DTOs.Ticket
{
    public class UpdateTicketPositionRequestDTO
    {
        public string Id { get; set; }
        public string ListId { get; set; }
        public int? NewPosition { get; set; } // Nullable int to represent optional property
    }
}
