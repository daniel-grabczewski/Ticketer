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
