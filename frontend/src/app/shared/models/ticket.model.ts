interface GetTicketDetailsResponse {
  id: string;
  name: string;
  description: string;
  position: number;
  colorId: string;
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
  colorId: string;
  name: string;
  description: string;
}
