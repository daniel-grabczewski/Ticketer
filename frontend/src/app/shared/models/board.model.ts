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
      colorId: number | null;
      description: string;
      name: string;
      position: number;
    }[];
  }[];
}

interface GetAllBoardsDetailsResponse {
  id: number;
  name: string;
  colorId: number | null;
  listCount: number;
  ticketCount: number;
}
[];

interface BoardRequestBase {
  id: string;
  colorId: number | null;
  name: string;
}

interface CreateBoardRequest extends BoardRequestBase {}

interface CreateDuplicateBoardRequest {
  originalBoardId: string;
  newBoardId: string;
  newName: string;
  colorId: number | null;
}

interface UpdateBoardRequest extends BoardRequestBase {}

interface DeleteBoardRequest extends DeleteRequestBase {}
