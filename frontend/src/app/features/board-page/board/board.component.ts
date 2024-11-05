// board.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Added for common directives
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../../core/services/board.service';
import { GetBoardFullDetailsResponse } from '../../../shared/models/board.model';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop'; // Imported DragDropModule and moveItemInArray
import { ListComponent } from '../components/list/list.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: true,
  imports: [CommonModule, DragDropModule, ListComponent], // Added imports
})
export class BoardComponent implements OnInit {
  boardDetails: GetBoardFullDetailsResponse | null = null;
  colorMap: { [key: number]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService
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
      // Implement list position update logic here
      const listId = this.boardDetails.lists[event.currentIndex].id;
      console.log('List position changed:', { listId, newPosition: event.currentIndex });
      // Call service to update list positions
    }
  }

  onTicketPositionChanged(event: { ticketId: string; listId: string; newPosition: number }): void {
    console.log('Ticket position changed:', event);
    // Implement ticket position update logic here
  }
}
