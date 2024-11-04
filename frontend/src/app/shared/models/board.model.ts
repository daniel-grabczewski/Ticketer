export interface GetBoardFullDetailsResponse {
  id: string;
  name: string;
  auth0Id: string;
  colorId: number | null;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
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
  id: string;
  name: string;
  colorId: number | null;
  listCount: number;
  ticketCount: number;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}
[];

export interface BoardRequestBase {
  id: string;
  colorId: number | null;
  name: string;
}

export interface UpdateBoardRequest extends BoardRequestBase {}

export interface CreateBoardRequest extends BoardRequestBase {}

export interface CreateDuplicateBoardRequest {
  originalBoardId: string;
  newBoardId: string;
  newName: string;
  colorId: number | null;
}
