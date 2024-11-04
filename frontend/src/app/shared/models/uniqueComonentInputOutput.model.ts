export interface BoardThumbnailInput {
  id: string;
  name: string;
  colorId: number;
}

export interface TicketInput {
  id: string;
  name: string;
  colorId: number | null;
  listId: string;
  position: number;
  colorMap: { [key: number]: string }; // Map of color IDs to their HEX codes
}

export interface TicketOutput {
  id: string;
  targetListId: string;
  newPosition: number;
}
