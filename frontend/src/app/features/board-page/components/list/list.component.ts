import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDragStart,
} from '@angular/cdk/drag-drop';
import { TicketComponent } from '../ticket/ticket.component';
import { TicketInput } from '../../../../shared/models/uniqueComponentInputOutput.model';
import { TicketService } from '../../../../core/services/ticket.service';
import { UpdateTicketPositionRequest } from '../../../../shared/models/ticket.model';
import { OverlayService } from '../../../../core/services/overlay.service';
import {
  MenuConfig,
  SubmenuOutputTransfer,
} from '../../../../shared/models/menu.model';
import {
  TextInputSubmenuOutput,
  ConfirmationSubmenuOutput,
  CreateBoardItemSubmenuOutput,
} from '../../../../shared/models/submenuInputOutput.model';
import { generateListActionsMenuConfig } from '../../../../shared/menuConfigs/listMenuConfig';
import { v4 as uuidv4 } from 'uuid';
import { CreateBoardItemSubmenuComponent } from '../../../../shared/components/create-board-item-submenu/create-board-item-submenu.component';
import { Router } from '@angular/router';
import { SubmenuInputTransfer } from '../../../../shared/models/menu.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    TicketComponent,
    CreateBoardItemSubmenuComponent,
  ],
})
export class ListComponent implements OnInit, OnChanges {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() position: number = 0;
  @Input() tickets: TicketInput[] = [];
  @Input() colorMap: { [key: number]: string } = {};
  @Input() connectedDropLists: string[] = [];
  @Input() boardId: string = '';
  @Input() boardNameSlug: string | null = null;

  @Output()
  ticketPositionChanged = new EventEmitter<{
    ticketId: string;
    oldListId: string;
    newListId: string;
    newPosition: number;
  }>();
  @Output() listRenamed = new EventEmitter<{ id: string; newName: string }>();
  @Output()
  listDuplicated = new EventEmitter<{
    originalListId: string;
    newListId: string;
    newListName: string;
  }>();
  @Output() listDeleted = new EventEmitter<string>();
  @Output()
  ticketCreated = new EventEmitter<{
    listId: string;
    id: string;
    name: string;
  }>();

  cdkDropListId!: string;

  // State variable replaced with overlay logic for menu
  menuConfig!: MenuConfig;

  // New state variable for the submenu
  showCreateTicketSubmenu: boolean = false;

  // Variables for renaming list
  isRenamingList: boolean = false;
  newListName: string = '';

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private overlayService: OverlayService,
    private cdr: ChangeDetectorRef
  ) {}
  draggedTicketHeight: number = 0;
  // Reintroducing the isDragging flag
  private isDragging: boolean = false;

  ngOnInit(): void {
    // Set a unique cdkDropListId
    this.cdkDropListId = 'cdk-drop-list-' + this.id;
    this.menuConfig = generateListActionsMenuConfig(this.name);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['name'] &&
      changes['name'].previousValue !== changes['name'].currentValue
    ) {
      this.menuConfig = generateListActionsMenuConfig(this.name);
    }
  }

  // Method to generate UUID for new tickets
  generateUUID(): string {
    return uuidv4();
  }

  onTicketClicked(ticketId: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the event from propagating
    if (!this.isDragging) {
      console.log('clicked!');
      const boardId = this.boardId;
      const boardNameSlug = this.boardNameSlug || '';
      if (boardNameSlug) {
        console.log(
          `boardNameSlug exists in onTicketClicked. Navigating..., boardId : ${boardId}, boardNameSlug : ${boardNameSlug}, ticketId : ${ticketId}`
        );
        this.router.navigate([
          '/board',
          boardId,
          boardNameSlug,
          'ticket',
          ticketId,
        ]);
      } else {
        this.router.navigate(['/board', boardId, 'ticket', ticketId]);
      }
    }
  }

  // Handler for reordering tickets within the list or moving between lists
  onTicketDrop(event: CdkDragDrop<TicketInput[]>): void {
    if (!event.item.data) {
      console.error('Dragged item data is undefined.');
      return;
    }

    const ticket: TicketInput = event.item.data;

    if (event.previousContainer === event.container) {
      // Moved within the same list
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update positions locally
      event.container.data.forEach((t, index) => {
        t.position = index + 1;
      });

      const request: UpdateTicketPositionRequest = {
        id: ticket.id,
        listId: this.id,
        newPosition: ticket.position,
      };

      this.ticketService.updateTicketPosition(request).subscribe({
        next: () => {
          console.log(
            `Ticket ${request.id} position updated to ${request.newPosition} in list ${request.listId}`
          );
        },
        error: (error) => {
          console.error(
            `Failed to update position for ticket ${request.id}:`,
            error
          );
        },
      });

      this.ticketPositionChanged.emit({
        ticketId: ticket.id,
        oldListId: this.id,
        newListId: this.id,
        newPosition: ticket.position,
      });
    } else {
      // Moved to a different list
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update positions in both lists
      event.container.data.forEach((t, index) => {
        t.position = index + 1;
      });
      event.previousContainer.data.forEach((t, index) => {
        t.position = index + 1;
      });

      // Extract list IDs by removing the prefix
      const oldListId = event.previousContainer.id.replace(
        'cdk-drop-list-',
        ''
      );
      const newListId = this.id;

      const request: UpdateTicketPositionRequest = {
        id: ticket.id,
        listId: newListId,
        newPosition: ticket.position,
      };

      this.ticketService.updateTicketPosition(request).subscribe({
        next: () => {
          console.log(
            `Ticket ${request.id} moved to list ${request.listId} at position ${request.newPosition}`
          );
        },
        error: (error) => {
          console.error(`Failed to move ticket ${request.id}:`, error);
        },
      });

      this.ticketPositionChanged.emit({
        ticketId: ticket.id,
        oldListId: oldListId,
        newListId: newListId,
        newPosition: ticket.position,
      });
    }
  }

  onDragStarted(event: CdkDragStart): void {
    this.isDragging = true;
    const element = event.source.element.nativeElement as HTMLElement;
    const ticketElement = element.querySelector('.ticket-container') as HTMLElement;
    if (ticketElement) {
      this.draggedTicketHeight = ticketElement.offsetHeight;
      console.log(this.draggedTicketHeight);
    } else {
      this.draggedTicketHeight = element.offsetHeight;
    }
    this.cdr.detectChanges(); // Notify Angular of the change
  }
  
  
    onDragEnded(): void {
      setTimeout(() => {
        this.isDragging = false;
        this.draggedTicketHeight = 0; // Reset the height
      }, 0);
    }

  // Methods for renaming the list title
  enableListRenaming(event: MouseEvent): void {
    event.stopPropagation();
    this.isRenamingList = true;
    this.newListName = this.name;
    // Wait for the input to be rendered, then focus and select text
    setTimeout(() => {
      const inputElement = document.getElementById(
        `list-name-input-${this.id}`
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.select();
      }
    }, 0);
  }

  saveListName(): void {
    if (this.newListName.trim() !== '') {
      if (this.newListName.trim() !== this.name) {
        this.onRenameList(this.newListName.trim());
      }
      this.name = this.newListName.trim();
    } else {
      // Revert to previous name
      this.newListName = this.name;
    }
    this.isRenamingList = false;
  }

  onListNameKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveListName();
    }
  }

  // Placeholder for renaming the list title
  onRenameList(newName: string): void {
    this.listRenamed.emit({ id: this.id, newName });
  }

  openMenuOverlay(event: Event) {
    const target = event.target as HTMLElement;
    if (this.menuConfig) {
      this.overlayService.openOverlay(target, this.menuConfig, (output) => {
        console.log('Menu action received in ListComponent callback:', output);
        this.handleMenuAction(output);
      });
    }
  }

  handleMenuAction(output: SubmenuOutputTransfer) {
    console.log('Handling submenu action in ListComponent:', output);
    const { purpose, payload } = output;
    switch (purpose) {
      case 'addATicket':
        const addTicketPayload = payload as TextInputSubmenuOutput;
        const newTicketId = this.generateUUID();
        this.ticketCreated.emit({
          listId: this.id,
          id: newTicketId,
          name: addTicketPayload.text.trim(),
        });
        break;
      case 'duplicateList':
        const duplicatePayload = payload as TextInputSubmenuOutput;
        const newListId = this.generateUUID();
        this.listDuplicated.emit({
          originalListId: this.id,
          newListId: newListId,
          newListName: duplicatePayload.text.trim(),
        });
        break;
      case 'deleteList':
        const confirmationPayload = payload as ConfirmationSubmenuOutput;
        if (confirmationPayload.confirmationStatus) {
          this.listDeleted.emit(this.id);
        }
        break;
      default:
        console.warn('Unknown submenu action:', output);
    }
  }

  // Methods for the Create Ticket Submenu
  onAddTicketButtonClick(): void {
    this.showCreateTicketSubmenu = true;
  }

  onCreateTicketSubmenuAction(output: CreateBoardItemSubmenuOutput): void {
    const newTicketId = this.generateUUID();
    this.ticketCreated.emit({
      listId: this.id,
      id: newTicketId,
      name: output.text.trim(),
    });
    this.showCreateTicketSubmenu = false;
  }

  onCreateTicketSubmenuClose(): void {
    this.showCreateTicketSubmenu = false;
  }

  // Handle click outside to save the list name
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isRenamingList) {
      const target = event.target as HTMLElement;
      const inputElement = document.getElementById(
        `list-name-input-${this.id}`
      );
      if (inputElement && !inputElement.contains(target)) {
        this.saveListName();
      }
    }
  }
}
