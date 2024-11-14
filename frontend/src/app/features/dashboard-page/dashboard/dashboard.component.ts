import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../../core/services/board.service';
import {
  CreateBoardRequest,
  GetAllBoardsDetailsResponse,
  UpdateBoardRequest,
} from '../../../shared/models/board.model';
import { BoardThumbnailComponent } from '../components/board-thumbnail/board-thumbnail.component';
import { SubmenuOutputTransfer } from '../../../shared/models/menu.model';
import { GenerateBoardSubmenuOutput } from '../../../shared/models/submenuInputOutput.model';
import { SubmenuInputTransfer } from '../../../shared/models/menu.model';
import { PlusButtonComponent } from '../../../shared/components/plus-button/plus-button.component';
import { OverlayService } from '../../../core/services/overlay.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, BoardThumbnailComponent, PlusButtonComponent],
})
export class DashboardComponent implements OnInit {
  submenuTitle = 'Generate Board';
  textInputLabel = 'Name';
  colorSelectionHeader = 'Background';
  buttonText = 'Create';
  defaultColorId: number | null = null;

  boards: GetAllBoardsDetailsResponse[] = [];
  openMenuBoardId: string | null = null; // Track the ID of the open menu

  constructor(
    private boardService: BoardService,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    this.fetchAllBoards();
  }

  fetchAllBoards() {
    this.boardService.getAllBoards().subscribe({
      next: (data) => {
        this.boards = data.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        console.log('Fetched and sorted boards:', this.boards);
      },
      error: (error) => {
        console.error('Error fetching boards:', error);
      },
    });
  }

  openSubmenu(event: Event) {
    const target = event.target as HTMLElement;
    const submenuData: SubmenuInputTransfer = {
      type: 'generate-board-submenu',
      purpose: 'createBoard',
      payload: {
        title: this.submenuTitle,
        colorId: this.defaultColorId,
        textInputLabel: this.textInputLabel,
        placeholder: 'Enter board name...',
        colorSelectionHeader: this.colorSelectionHeader,
        buttonText: this.buttonText,
      },
    };

    // Using the updated overlay service with callback
    this.overlayService.openSubmenuOverlay(target, submenuData, (output) => {
      if (output && output.type === 'generate-board-submenu') {
        this.handleMenuAction(output);
      }
    });
  }

  handleMenuAction(output: SubmenuOutputTransfer) {
    console.log('Received submenu action in DashboardComponent:', output);

    if (output.type === 'text-input-submenu' && output.payload) {
      console.log('you used the text-input!');
    }

    if (output.type === 'generate-board-submenu' && output.payload) {
      const { name, colorId } = output.payload as GenerateBoardSubmenuOutput;
      const newBoardId = uuidv4();
      const request: CreateBoardRequest = {
        id: newBoardId,
        name,
        colorId,
      };

      this.boardService.createBoard(request).subscribe({
        next: () => {
          this.boards.push({
            id: newBoardId,
            name,
            colorId,
            listCount: 0,
            ticketCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          console.log('Created new board:', { id: newBoardId, name, colorId });
        },
        error: (error) => {
          console.error('Error creating board:', error);
        },
      });
      // The overlay closes automatically after the action
    }
  }

  onBoardUpdated(
    boardId: string,
    updatedData: Partial<GetAllBoardsDetailsResponse>
  ) {
    console.log('In onBoardUpdated');
    const existingBoard = this.boards.find((board) => board.id === boardId);
    if (!existingBoard) {
      console.error('Board not found:', boardId);
      return;
    }

    const updateRequest: UpdateBoardRequest = {
      id: boardId,
      name: updatedData.name ?? existingBoard.name,
      colorId: updatedData.colorId ?? existingBoard.colorId,
    };

    this.boardService.updateBoard(updateRequest).subscribe({
      next: () => {
        this.boards = this.boards.map((board) =>
          board.id === boardId
            ? { ...board, ...updatedData, updatedAt: new Date().toISOString() }
            : board
        );
        console.log('Updated board:', boardId, updatedData);
      },
      error: (error) => {
        console.error('Failed to update board:', error);
      },
    });
  }

  onBoardDeleted(boardId: string) {
    this.boardService.deleteBoard(boardId).subscribe({
      next: () => {
        this.boards = this.boards.filter((board) => board.id !== boardId);
        console.log('Deleted board:', boardId);
      },
      error: (error) => {
        console.error('Failed to delete board:', error);
      },
    });
  }

  onBoardDuplicated(newBoardData: {
    newName: string;
    colorId: number | null;
    originalBoardId: string;
  }) {
    const newBoardId = uuidv4();

    const duplicateRequest = {
      originalBoardId: newBoardData.originalBoardId,
      newBoardId,
      newName: newBoardData.newName,
      colorId: newBoardData.colorId,
    };

    console.log('Sending duplicate request with:', duplicateRequest);

    this.boardService.duplicateBoard(duplicateRequest).subscribe({
      next: () => {
        console.log('Duplicate request succeeded. Adding new board to list.');
        this.boards.push({
          id: newBoardId,
          name: newBoardData.newName,
          colorId: newBoardData.colorId,
          listCount: 0,
          ticketCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      },
      error: (error) => {
        console.error('Failed to duplicate board:', error);
      },
    });
  }

  toggleBoardMenu(boardId: string) {
    console.log('Toggling menu for boardId:', boardId);
    this.openMenuBoardId = this.openMenuBoardId === boardId ? null : boardId;
    console.log('Current open menu board ID:', this.openMenuBoardId);
  }
}
