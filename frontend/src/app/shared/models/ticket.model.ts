interface GetTicketDetailsResponse {
  id: string;
  name: string;
  description: string;
  position: number;
  colorId: number | null;
  listId: string;
  listName: string;
  boardId: string;
}

interface CreateTicketRequest {
  id: string;
  name: string;
  listId: string;
}

interface UpdateTicketRequest {
  id: string;
  colorId: number | null;
  name: string;
  description: string;
}

interface UpdateTicketPositionRequest {
  id: string;
  listId: string;
  newPosition?: number;
}

interface DeleteTicketRequest extends DeleteRequestBase {}
