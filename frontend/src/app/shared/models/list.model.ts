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

interface CreateListRequest {
  id: string;
  boardId: string;
  name: string;
}

interface UpdateListPositionRequest {
  id: string;
  newPosition: number;
}

interface UpdateListRequest extends ListDetailsBase {}

interface DeleteListRequest extends DeleteRequestBase {}
