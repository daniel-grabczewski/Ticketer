interface GetBoardFullDetailsResponse {
  id: number;
  name: string;
  auth0Id: string;
  lists: {
    id: string;
    name: string;
    position: number;
    tickets: {
      id: string;
      coverId: number;
      description: string;
      name: string;
      position: number;
    }[];
  }[];
}

interface GetAllBoardsDetailsResponse {
  id: number;
  name: string;
  colorId: number;
  listCount: number;
  ticketCount: number;
}
[];

interface BoardRequestBase {
  id: string;
  colorId: string;
  name: string;
}

interface CreateBoardRequest extends BoardRequestBase {}

interface CreateDuplicateBoardRequest {
  originalBoardId: string;
  newBoardId: string;
  newName: string;
  colorId: number;
}

interface UpdateBoardRequest extends BoardRequestBase {}

interface DeleteBoardRequest extends DeleteRequestBase {}