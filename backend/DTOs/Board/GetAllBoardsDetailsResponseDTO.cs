namespace DTOs.Board
{
    public class GetAllBoardsDetailsResponseDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; } 
        public DateTime UpdatedAt { get; set; } 
        public int? ColorId { get; set; }
        public int ListCount { get; set; }
        public int TicketCount { get; set; }
    }
}
