import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
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
import { OverlayService } from '../../../core/services/overlay.service';
import {
  MenuConfig,
  SubmenuOutputTransfer,
} from '../../../shared/models/menu.model';
import {
  TextInputSubmenuOutput,
  ConfirmationSubmenuOutput,
  BackgroundSelectionSubmenuOutput,
  GenerateBoardSubmenuOutput,
} from '../../../shared/models/submenuInputOutput.model';
import { generateBoardActionsMenuConfig } from '../../../shared/menuConfigs/boardMenuConfig';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TicketUpdateService } from '../../../core/services/ticket-update.service';
import { TicketInput } from '../../../shared/models/uniqueComponentInputOutput.model';
import { PlusButtonComponent } from '../../../shared/components/plus-button/plus-button.component';
import { CdkScrollable, CdkScrollableModule } from '@angular/cdk/scrolling';
import { DragStateService } from '../../../core/services/drag-state.service';
import { UtilsService } from '../../../shared/utils/utils.service';
import { CogButtonComponent } from '../../../shared/components/cog-button/cog-button.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    ListComponent,
    CreateBoardItemSubmenuComponent,
    RouterModule,
    PlusButtonComponent,
    CdkScrollableModule,
    CogButtonComponent,
  ],
})
export class BoardComponent implements OnInit, OnDestroy, AfterViewInit {
  boardDetails: GetBoardFullDetailsResponse | null = null;
  colorMap: { [key: number]: string } = {};
  listIds: string[] = []; // List of all cdkDropListIds

  showCreateListSubmenu: boolean = false;

  menuConfig!: MenuConfig;
  isRenamingBoard: boolean = false;
  listRenamingStatus: boolean = false;
  newBoardName: string = '';
  private routeSub!: Subscription;
  private ticketUpdateSub!: Subscription;
  plusButtonHoverColor: string = 'var(--secondary)';
  plusButtonColor: string = 'var(--secondary-darker)';
  backgroundColor: string = 'var(--background)';

  // Boolean to keep track of whether dragging list should be disabled
  isListDraggingDisabled: boolean = false;

  boardNameSlug: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private listService: ListService,
    private ticketService: TicketService,
    private ticketUpdateService: TicketUpdateService,
    private overlayService: OverlayService,
    private dragStateService: DragStateService,
    private utilsService: UtilsService
  ) {}

  // ViewChild to get the ElementRef of the scrollable container
  @ViewChild('scrollableBoard')
  scrollableBoardElementRef!: ElementRef;

  // ViewChild to get the ElementRef of the contenteditable span
  @ViewChild('boardNameSpan', { static: false })
  boardNameSpan!: ElementRef;

  ngAfterViewInit(): void {
    // After the view is initialized, we can set up any necessary references
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const boardId = params.get('boardId');
      this.boardNameSlug = params.get('boardNameSlug');
      if (boardId) {
        this.fetchBoardDetails(boardId);
        this.loadColorMap();
      }
    });

    this.ticketUpdateSub = this.ticketUpdateService.ticketUpdated$.subscribe(
      (updatedTicket) => {
        this.handleTicketUpdate(updatedTicket);
      }
    );
  }

  ngOnDestroy(): void {
    this.stopScrolling();
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.ticketUpdateSub) {
      this.ticketUpdateSub.unsubscribe();
    }
  }

  onDragStarted() {
    this.dragStateService.setIsDragging(true);
  }

  onDragEnded() {
    this.dragStateService.setIsDragging(false);
  }

  onBoardNameKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent inserting a newline
      this.saveBoardName();
    }
  }

  onBoardNameInput(): void {
    // Remove any newline characters to prevent new lines
    let content = this.boardNameSpan.nativeElement.textContent;
    content = content.replace(/[\r\n]+/g, '');
    this.boardNameSpan.nativeElement.textContent = content;

    // Update newBoardName with the current content
    this.newBoardName = content;

    // Scroll to the end to show the latest characters
    this.boardNameSpan.nativeElement.scrollLeft =
      this.boardNameSpan.nativeElement.scrollWidth;
  }

  onBoardNamePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      let text = clipboardData.getData('text/plain');
      // Remove any newline characters
      const sanitizedText = text.replace(/[\r\n]+/g, '');
      // Insert the sanitized text at the cursor position
      this.insertTextAtCursor(sanitizedText);
    }
  }

  insertTextAtCursor(text: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }
    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    // Move the caret after the inserted text node
    range.setStartAfter(textNode);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    // Update the newBoardName with the inserted text
    this.onBoardNameInput();
  }

  private scrollSpeed = 2000; // Pixels per frame
  private scrollFrame: any; // For canceling requestAnimationFrame
  private currentScrollSpeed = 0; // Member variable for current speed
  private lastTimestamp: number = 0;

  // Listener for mouse movement
  @HostListener('window:mousemove', ['$event'])
handleMouseMove(event: MouseEvent): void {
  console.log("hello")
  if (!this.dragStateService.getIsDragging()) {
    return;
  }

  if (!this.scrollableBoardElementRef) {
    return; // Wait until the ViewChild is available
  }

  const threshold = 50; // Distance from the edge to trigger scrolling
  const rect =
    this.scrollableBoardElementRef.nativeElement.getBoundingClientRect();

  // Check if the cursor is within the threshold near the left edge
  if (event.clientX - rect.left < threshold) {
    this.startScrolling(-this.scrollSpeed); // Scroll left
  }
  // Check if the cursor is within the threshold near the right edge
  else if (rect.right - event.clientX < threshold) {
    this.startScrolling(this.scrollSpeed); // Scroll right
  } else {
    this.stopScrolling(); // Stop scrolling when the cursor is not near an edge
  }
}

private startScrolling(speed: number): void {
  this.currentScrollSpeed = speed;
  if (this.scrollFrame) return;
  this.lastTimestamp = 0; // Reset timestamp
  this.scrollFrame = requestAnimationFrame((timestamp) => this.smoothScroll(timestamp));
}

private stopScrolling(): void {
  if (this.scrollFrame) {
    cancelAnimationFrame(this.scrollFrame);
    this.scrollFrame = null;
    this.currentScrollSpeed = 0; // Reset the speed
  }
}

private smoothScroll(timestamp: number): void {
  const element = this.scrollableBoardElementRef.nativeElement;

  console.log('scrollLeft:', element.scrollLeft);
  console.log('scrollWidth:', element.scrollWidth);
  console.log('clientWidth:', element.clientWidth);
  console.log('maxScrollLeft:', element.scrollWidth - element.clientWidth);
  if (!this.lastTimestamp) {
    this.lastTimestamp = timestamp;
  }

  const deltaTime = (timestamp - this.lastTimestamp) / 1000; // Convert to seconds
  this.lastTimestamp = timestamp;

  // Adjust the scrollLeft value using speed and deltaTime
  element.scrollLeft += this.currentScrollSpeed * deltaTime;

  // Ensure scrolling stays within bounds
  const maxScrollLeft = element.scrollWidth - element.clientWidth;
  if (element.scrollLeft <= 0 || element.scrollLeft >= maxScrollLeft) {
    this.stopScrolling();
    return;
  }

  this.scrollFrame = requestAnimationFrame((timestamp) => this.smoothScroll(timestamp));
}

  private handleTicketUpdate(updatedTicket: TicketInput): void {
    if (this.boardDetails && this.boardDetails.lists) {
      // Find the list containing the ticket
      const listContainingTicket = this.boardDetails.lists.find((list) =>
        list.tickets.some((ticket) => ticket.id === updatedTicket.id)
      );

      // Remove the ticket from its current list if necessary
      if (listContainingTicket) {
        listContainingTicket.tickets = listContainingTicket.tickets.filter(
          (ticket) => ticket.id !== updatedTicket.id
        );
      }

      if (updatedTicket.deleted) {
        // Ticket was deleted, no need to add it back
        return;
      }

      // Find the new list and add or update the ticket
      const targetList = this.boardDetails.lists.find(
        (list) => list.id === updatedTicket.listId
      );

      if (targetList) {
        // Check if the ticket already exists in the target list
        const existingTicketIndex = targetList.tickets.findIndex(
          (ticket) => ticket.id === updatedTicket.id
        );

        if (existingTicketIndex !== -1) {
          // Update the existing ticket
          targetList.tickets[existingTicketIndex] = updatedTicket;
        } else {
          // Add the ticket to the target list
          targetList.tickets.push(updatedTicket);
        }
      }
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
        // Generate menu config
        this.menuConfig = generateBoardActionsMenuConfig(
          this.boardDetails.name,
          this.boardDetails.colorId
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

  onIsHoldingNonListItem(isHolding: boolean): void {
    this.isListDraggingDisabled = isHolding;
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

  onListRenaming(isRenamingList: boolean): void {
    this.listRenamingStatus = isRenamingList;
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

  /**
   * Replaces toggleMenu logic to open an overlay using OverlayService for the menu.
   * The menu is configured using `menuConfig` and opened via an overlay.
   */
  openMenuOverlay(event: Event) {
    const originElement = event.target as HTMLElement;
    if (this.menuConfig && originElement) {
      this.overlayService.openOverlay(
        originElement,
        this.menuConfig,
        (output) => {
          this.handleMenuAction(output);
        }
      );
    }
  }

  /**
   * Processes the action from submenu output using the new overlay system.
   * Previously handled by menuAction from <app-menu>.
   */
  handleMenuAction(output: SubmenuOutputTransfer) {
    console.log('Handling submenu action in BoardComponent:', output);
    const { purpose, payload } = output;
    switch (purpose) {
      case 'editBackground':
        const backgroundPayload = payload as BackgroundSelectionSubmenuOutput;
        this.updateBoard({
          colorId: backgroundPayload.colorId,
          name: this.boardDetails!.name,
        });
        break;
      case 'renameBoard':
        const renamePayload = payload as TextInputSubmenuOutput;
        this.updateBoard({
          name: renamePayload.text.trim(),
          colorId: this.boardDetails!.colorId,
        });
        break;
      case 'duplicateBoard':
        const duplicatePayload = payload as GenerateBoardSubmenuOutput;
        const newBoardId = uuidv4();
        const duplicateRequest = {
          originalBoardId: this.boardDetails!.id,
          newBoardId: newBoardId,
          newName: duplicatePayload.name.trim(),
          colorId: duplicatePayload.colorId,
        };
        this.boardService.duplicateBoard(duplicateRequest).subscribe({
          next: () => {
            console.log('Board duplicated:', duplicateRequest);
            // Navigate to the new board
            const slug = duplicateRequest.newName
              .replace(/\s+/g, '-')
              .toLowerCase();
            this.router.navigate(['/board', duplicateRequest.newBoardId, slug]);
          },
          error: (error) => {
            console.error('Failed to duplicate board:', error);
          },
        });
        break;
      case 'deleteBoard':
        const deletePayload = payload as ConfirmationSubmenuOutput;
        if (deletePayload.confirmationStatus) {
          this.boardService.deleteBoard(this.boardDetails!.id).subscribe({
            next: () => {
              console.log('Board deleted:', this.boardDetails!.id);
              // Navigate back to dashboard or another appropriate page
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              console.error('Failed to delete board:', error);
            },
          });
        }
        break;
      default:
        console.warn('Unknown submenu action:', output);
    }
  }

  private updateBoard(updatedData: { name: string; colorId: number | null }) {
    const updateRequest = {
      id: this.boardDetails!.id,
      name: updatedData.name,
      colorId: updatedData.colorId,
    };
    this.boardService.updateBoard(updateRequest).subscribe({
      next: () => {
        // Update local boardDetails
        this.boardDetails!.name = updatedData.name;
        this.boardDetails!.colorId = updatedData.colorId;
        // Update menu config
        this.menuConfig = generateBoardActionsMenuConfig(
          this.boardDetails!.name,
          this.boardDetails!.colorId
        );
        console.log('Board updated:', updateRequest);
      },
      error: (error) => {
        console.error('Failed to update board:', error);
      },
    });
  }

  // Renaming board from the top-left name
  enableBoardRenaming(event: MouseEvent): void {
    event.stopPropagation(); // Prevent event from propagating
    this.isRenamingBoard = true;
    this.newBoardName = this.boardDetails!.name;

    // Wait for the view to update
    setTimeout(() => {
      // Set the content of the span
      this.boardNameSpan.nativeElement.textContent = this.newBoardName;

      // Focus the contenteditable span
      this.boardNameSpan.nativeElement.focus();

      // Select all text
      const range = document.createRange();
      range.selectNodeContents(this.boardNameSpan.nativeElement);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }, 0);
  }

  saveBoardName(): void {
    // Ensure we have the latest content
    this.newBoardName = this.boardNameSpan.nativeElement.textContent.trim();

    if (this.newBoardName !== '') {
      if (this.newBoardName !== this.boardDetails?.name) {
        this.updateBoard({
          name: this.utilsService.cleanStringWhiteSpace(this.newBoardName),
          colorId: this.boardDetails!.colorId,
        });
        this.boardDetails!.name = this.utilsService.cleanStringWhiteSpace(
          this.newBoardName
        );
      }
    } else {
      // If empty, revert to previous name
      this.newBoardName = this.boardDetails!.name;
      this.boardNameSpan.nativeElement.textContent = this.newBoardName;
    }
    this.isRenamingBoard = false;
  }

  cancelBoardRenaming(): void {
    this.isRenamingBoard = false;
  }

  // Handle click outside to close menu or cancel renaming
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const menuButton = document.getElementById('board-menu-button');
    const boardNameInput = document.getElementById('board-name-input');

    if (
      this.isRenamingBoard &&
      boardNameInput &&
      !boardNameInput.contains(target)
    ) {
      this.saveBoardName();
    }
  }

  // Method to get background style based on colorId
  getBackgroundStyle(): { [key: string]: string } {
    const colorId = this.boardDetails?.colorId;
    return colorId
      ? { 'background-image': `var(--gradient-${colorId})` }
      : { 'background-color': 'var(--neutral-darker)' };
  }
}
