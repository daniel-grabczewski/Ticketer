import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../../core/services/board.service';
import { GetBoardFullDetailsResponse } from '../../../shared/models/board.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardDetails: GetBoardFullDetailsResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    // Retrieve the board ID from the URL and fetch board details
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (boardId) {
      this.fetchBoardDetails(boardId);
    }
  }

  /**
   * Fetches and stores the full details of a board using the board ID.
   * @param boardId The ID of the board.
   */
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
}
