namespace DTOs.Ticket
{
    public class UpdateTicketRequestDTO
    {
        public string Id { get; set; }
        public int? ColorId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
