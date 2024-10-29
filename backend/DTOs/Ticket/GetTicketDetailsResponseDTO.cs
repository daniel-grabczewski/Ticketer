namespace DTOs.Ticket
{
    public class GetTicketDetailsResponseDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Position { get; set; }
        public int? ColorId { get; set; } // Made nullable
        public string ListId { get; set; }
        public string ListName { get; set; }
        public string BoardId { get; set; }
    }
}