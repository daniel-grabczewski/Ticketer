export interface GetBoardFullDetailsResponse {
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

export interface GetAllBoardsDetailsResponse {
  id: number;
  name: string;
  colorId: number | null;
  listCount: number;
  ticketCount: number;
}
[];

export interface BoardRequestBase {
  id: string;
  colorId: number | null;
  name: string;
}

export interface CreateBoardRequest extends BoardRequestBase {}

export interface CreateDuplicateBoardRequest {
  originalBoardId: string;
  newBoardId: string;
  newName: string;
  colorId: number | null;
}

export interface UpdateBoardRequest extends BoardRequestBase {}

export interface DeleteBoardRequest extends DeleteRequestBase {}
