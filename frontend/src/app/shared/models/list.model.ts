export interface ListDetailsBase {
  id: string;
  name: string;
}

export interface GetAllListsDetailsResponse extends ListDetailsBase {}

export interface CreateDuplicateListRequest {
  originalListId: string;
  newListId: string;
  newListName: string;
  boardId: string;
}

export interface CreateListRequest {
  id: string;
  boardId: string;
  name: string;
}

export interface UpdateListPositionRequest {
  id: string;
  newPosition: number;
}

export interface UpdateListRequest extends ListDetailsBase {}
