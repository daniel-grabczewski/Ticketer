import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../../core/services/board.service';
import { ListService } from '../../../core/services/list.service';
import { TicketService } from '../../../core/services/ticket.service';
import { GetBoardFullDetailsResponse } from '../../../shared/models/board.model';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ListComponent } from '../components/list/list.component';
import {
  UpdateListPositionRequest,
  UpdateListRequest,
  CreateDuplicateListRequest,
  CreateListRequest,
} from '../../../shared/models/list.model';
import { CreateTicketRequest } from '../../../shared/models/ticket.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateBoardItemSubmenuComponent } from '../../../shared/components/create-board-item-submenu/create-board-item-submenu.component';
import { CreateBoardItemSubmenuOutput } from '../../../shared/models/submenuInputOutput.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    ListComponent,
    CreateBoardItemSubmenuComponent,
  ],
})
export class BoardComponent implements OnInit {
  boardDetails: GetBoardFullDetailsResponse | null = null;
  colorMap: { [key: number]: string } = {};
  listIds: string[] = []; // List of all cdkDropListIds

  showCreateListSubmenu: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private listService: ListService,
    private ticketService: TicketService
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
        // Generate listIds with prefixes
        this.listIds = this.boardDetails.lists.map(
          (list) => 'cdk-drop-list-' + list.id
        );
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
      moveItemInArray(
        this.boardDetails.lists,
        event.previousIndex,
        event.currentIndex
      );

      // Update positions locally
      this.boardDetails.lists.forEach((list, index) => {
        list.position = index + 1;
      });

      // Prepare update requests for the backend
      const updateRequests: UpdateListPositionRequest[] =
        this.boardDetails.lists.map((list) => ({
          id: list.id,
          newPosition: list.position,
        }));

      // Send update requests to the backend
      updateRequests.forEach((request) => {
        this.listService.updateListPosition(request).subscribe({
          next: () => {
            console.log(
              `List ${request.id} position updated to ${request.newPosition}`
            );
          },
          error: (error) => {
            console.error(
              `Failed to update position for list ${request.id}:`,
              error
            );
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
    // Implement additional logic here if needed
  }

  // Handler for list renamed
  onListRenamed(event: { id: string; newName: string }): void {
    console.log('List renamed:', event);
    if (this.boardDetails && this.boardDetails.lists) {
      const listToRename = this.boardDetails.lists.find(
        (list) => list.id === event.id
      );
      if (listToRename) {
        const updateRequest: UpdateListRequest = {
          id: event.id,
          name: event.newName,
        };
        this.listService.updateList(updateRequest).subscribe({
          next: () => {
            listToRename.name = event.newName;
            console.log(`List ${event.id} renamed to ${event.newName}`);
          },
          error: (error) => {
            console.error(`Failed to rename list ${event.id}:`, error);
          },
        });
      }
    }
  }

  // Handler for list duplicated
  onListDuplicated(event: {
    originalListId: string;
    newListId: string;
    newListName: string;
  }): void {
    console.log('List duplicated:', event);
    if (this.boardDetails && this.boardDetails.lists) {
      const duplicateRequest: CreateDuplicateListRequest = {
        originalListId: event.originalListId,
        newListId: event.newListId,
        newListName: event.newListName,
        boardId: this.boardDetails.id,
      };
      this.listService.duplicateList(duplicateRequest).subscribe({
        next: () => {
          // Fetch the board details again to get the updated lists
          this.fetchBoardDetails(this.boardDetails!.id);
          console.log(
            `List ${event.originalListId} duplicated as ${event.newListId}`
          );
        },
        error: (error) => {
          console.error(
            `Failed to duplicate list ${event.originalListId}:`,
            error
          );
        },
      });
    }
  }

  // Handler for list deleted
  onListDeleted(listId: string): void {
    console.log('List deleted:', listId);
    if (this.boardDetails && this.boardDetails.lists) {
      this.listService.deleteList(listId).subscribe({
        next: () => {
          // Remove the list from the local array
          this.boardDetails!.lists = this.boardDetails!.lists.filter(
            (list) => list.id !== listId
          );
          console.log(`List ${listId} deleted`);
        },
        error: (error) => {
          console.error(`Failed to delete list ${listId}:`, error);
        },
      });
    }
  }

  // Handler for ticket created
  onTicketCreated(event: { listId: string; id: string; name: string }): void {
    console.log('Ticket created:', event);
    const request: CreateTicketRequest = {
      id: event.id,
      name: event.name,
      listId: event.listId,
    };
    this.ticketService.createTicket(request).subscribe({
      next: () => {
        // Add the ticket to the local list
        if (this.boardDetails && this.boardDetails.lists) {
          const list = this.boardDetails.lists.find(
            (l) => l.id === event.listId
          );
          if (list) {
            const newTicket = {
              id: event.id,
              name: event.name,
              description: '',
              colorId: null,
              position: list.tickets.length + 1,
            };
            list.tickets.push(newTicket);
            console.log(`Ticket ${event.id} created in list ${event.listId}`);
          }
        }
      },
      error: (error) => {
        console.error(`Failed to create ticket ${event.id}:`, error);
      },
    });
  }

  // Methods for the Create List Submenu
  onAddListButtonClick(): void {
    this.showCreateListSubmenu = true;
  }

  onCreateListSubmenuAction(output: CreateBoardItemSubmenuOutput): void {
    const newListId = uuidv4();
    const request: CreateListRequest = {
      id: newListId,
      boardId: this.boardDetails!.id,
      name: output.text.trim(),
    };
    this.listService.createList(request).subscribe({
      next: () => {
        // Fetch the board details again to get the updated lists
        this.fetchBoardDetails(this.boardDetails!.id);
        console.log(`List ${newListId} created`);
      },
      error: (error) => {
        console.error(`Failed to create list ${newListId}:`, error);
      },
    });
    this.showCreateListSubmenu = false;
  }

  onCreateListSubmenuClose(): void {
    this.showCreateListSubmenu = false;
  }
}
