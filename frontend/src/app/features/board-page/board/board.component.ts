import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../../core/services/board.service';
import { ListService } from '../../../core/services/list.service'; // Import ListService
import { GetBoardFullDetailsResponse } from '../../../shared/models/board.model';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ListComponent } from '../components/list/list.component';
import { UpdateListPositionRequest } from '../../../shared/models/list.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: true,
  imports: [CommonModule, DragDropModule, ListComponent],
})
export class BoardComponent implements OnInit {
  boardDetails: GetBoardFullDetailsResponse | null = null;
  colorMap: { [key: number]: string } = {};
  listIds: string[] = []; // List of all list IDs

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private listService: ListService // Inject ListService
  ) {}

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (boardId) {
      this.fetchBoardDetails(boardId);
      this.loadColorMap();
    }
  }

  private fetchBoardDetails(boardId: string): void {
    this.boardService.getBoardById(boardId).subscribe({
      next: (data) => {
        this.boardDetails = data;
        this.listIds = this.boardDetails.lists.map((list) => list.id); // Store list IDs
        console.log('Board details retrieved:', this.boardDetails);
      },
      error: (error) => {
        console.error('Failed to retrieve board details:', error);
      },
    });
  }

  private loadColorMap(): void {
    this.colorMap = {
      1: '#50C996',
      2: '#3BBA3B',
      3: '#8131F9',
      4: '#FEA362',
      5: '#F773BE',
      6: '#EE4646',
    };
  }

  // Event handler for dragging lists
  onListDrop(event: CdkDragDrop<any[]>): void {
    if (this.boardDetails && this.boardDetails.lists) {
      moveItemInArray(this.boardDetails.lists, event.previousIndex, event.currentIndex);

      // Update positions locally
      this.boardDetails.lists.forEach((list, index) => {
        list.position = index + 1; // Assuming positions start from 1
      });

      // Prepare update requests for the backend
      const updateRequests: UpdateListPositionRequest[] = this.boardDetails.lists.map((list) => ({
        id: list.id,
        newPosition: list.position,
      }));

      // Send update requests to the backend
      updateRequests.forEach((request) => {
        this.listService.updateListPosition(request).subscribe({
          next: () => {
            console.log(`List ${request.id} position updated to ${request.newPosition}`);
          },
          error: (error) => {
            console.error(`Failed to update position for list ${request.id}:`, error);
          },
        });
      });
    }
  }

  // Handler for ticket position changes
  onTicketPositionChanged(event: {
    ticketId: string;
    oldListId: string;
    newListId: string;
    newPosition: number;
  }): void {
    console.log('Ticket position changed:', event);
    // Implement ticket position update logic here if needed
  }
}
