namespace DTOs.Board
{
    public class ListDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Position { get; set; }
        public List<TicketDTO> Tickets { get; set; }
    }
}
