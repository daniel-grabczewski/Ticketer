export interface GetTicketDetailsResponse {
  id: string;
  name: string;
  description: string;
  position: number;
  colorId: number | null;
  listId: string;
  listName: string;
  boardId: string;
}

export interface CreateTicketRequest {
  id: string;
  name: string;
  listId: string;
}

export interface UpdateTicketRequest {
  id: string;
  colorId: number | null;
  name: string;
  description: string;
}

export interface UpdateTicketPositionRequest {
  id: string;
  listId: string;
  newPosition?: number;
}

export interface DeleteTicketRequest extends DeleteRequestBase {}
