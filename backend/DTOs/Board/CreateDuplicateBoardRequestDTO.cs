namespace DTOs.Board
{
    public class CreateDuplicateBoardRequestDTO
    {
        public string OriginalBoardId { get; set; }
        public string NewBoardId { get; set; }
        public string NewName { get; set; }
        public int? ColorId { get; set; }
    }
}
