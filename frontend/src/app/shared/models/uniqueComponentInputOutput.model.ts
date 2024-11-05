export interface BoardThumbnailInput {
  id: string;
  name: string;
  colorId: number;
}

export interface TicketInput {
  id: string;
  name: string;
  description: string;
  colorId: number | null;
  position: number;
}

export interface TicketOutput {
  id: string;
  targetListId: string;
  newPosition: number;
}
