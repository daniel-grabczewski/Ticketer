interface ListDetailsBase {
  id: string;
  name: string;
}

interface GetAllListsDetailsResponse extends ListDetailsBase {}

interface CreateDuplicateListRequest {
  originalListId: string;
  newListId: string;
  newListName: string;
  boardId: string;
}
