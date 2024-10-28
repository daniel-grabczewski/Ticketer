namespace DTOs.Board
{
    public class GetBoardFullDetailsResponseDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Auth0Id { get; set; }
        public List<ListDTO> Lists { get; set; }
    }
}
