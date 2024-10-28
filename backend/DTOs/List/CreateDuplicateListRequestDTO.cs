namespace DTOs.List
{
    public class CreateDuplicateListRequestDTO
    {
        public string OriginalListId { get; set; }
        public string NewListId { get; set; }
        public string NewListName { get; set; }
        public string BoardId { get; set; }
    }
}
