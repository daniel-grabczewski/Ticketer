import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { TicketService } from '../../../../core/services/ticket.service';
import { ListService } from '../../../../core/services/list.service';
import { ColorService } from '../../../../core/services/color.service';
import {
  GetTicketDetailsResponse,
  UpdateTicketRequest,
  UpdateTicketPositionRequest,
} from '../../../../shared/models/ticket.model';
import { GetAllListsDetailsResponse } from '../../../../shared/models/list.model';
import { FormsModule } from '@angular/forms';
import {
  DropdownSubmenuOutput,
  ColorSelectionSubmenuOutput,
  ConfirmationSubmenuOutput,
  DropdownSubmenuInput,
  ColorSelectionSubmenuInput,
  ConfirmationSubmenuInput,
} from '../../../../shared/models/submenuInputOutput.model';
import { TicketUpdateService } from '../../../../core/services/ticket-update.service';
import { TicketInput } from '../../../../shared/models/uniqueComponentInputOutput.model';
import { OverlayService } from '../../../../core/services/overlay.service';
import {
  SubmenuInputTransfer,
  SubmenuOutputTransfer,
} from '../../../../shared/models/menu.model';
import { UtilsService } from '../../../../shared/utils/utils.service';

@Component({
  selector: 'app-ticket-detailed-view',
  templateUrl: './ticket-detailed-view.component.html',
  styleUrls: ['./ticket-detailed-view.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TicketDetailedViewComponent implements OnInit, OnDestroy {
  ticketId!: string;
  boardId!: string;
  boardNameSlug: string | null = null;
  ticketDetails!: GetTicketDetailsResponse;
  colorHex: string = '';
  lists: GetAllListsDetailsResponse[] = [];
  errorLoadingTicket: boolean = false;
  isEditingName: boolean = false;
  isEditingDescription: boolean = false;
  newName: string = '';
  newDescription: string = '';
  disableCloseOnOutsideClick: boolean = false;

  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private listService: ListService,
    private colorService: ColorService,
    private ticketUpdateService: TicketUpdateService,
    private overlayService: OverlayService,
    private utilsService : UtilsService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes
    console.log('Ticket-detailed-view loaded');
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      this.ticketId = params.get('ticketId')!;
      // Get boardId and boardNameSlug from parent route
      this.boardId = this.route.parent?.snapshot.paramMap.get('boardId')!;
      this.boardNameSlug =
        this.route.parent?.snapshot.paramMap.get('boardNameSlug') || null;
      this.fetchTicketDetails();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      console.log('Destroyed');
      this.routeSub.unsubscribe();
    }
  }

  fetchTicketDetails(): void {
    this.errorLoadingTicket = false;
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (ticketData) => {
        this.ticketDetails = ticketData;
        this.newName = this.ticketDetails.name;
        this.newDescription = this.ticketDetails.description;
        if (this.ticketDetails.colorId) {
          this.colorHex = this.getColorHex(this.ticketDetails.colorId);
        } else {
          this.colorHex = '#CCCCCC'; // Default color
        }
        // listName is already included in ticketDetails
      },
      error: (error) => {
        console.error('Failed to retrieve ticket details:', error);
        this.errorLoadingTicket = true;
      },
    });
  }

  getColorHex(colorId: number): string {
    // Assuming a predefined color map, you can adjust this as needed
    const colorMap: { [key: number]: string } = {
      1: '#50C996',
      2: '#3BBA3B',
      3: '#8131F9',
      4: '#FEA362',
      5: '#F773BE',
      6: '#EE4646',
    };
    return colorMap[colorId] || '#CCCCCC';
  }

  // Close the ticket detailed view
  closeTicketView(): void {
    // Navigate back to the board route using absolute navigation
    if (this.boardId) {
      if (this.boardNameSlug) {
        console.log('board slug exists');
        this.router.navigate(['/board', this.boardId, this.boardNameSlug]);
      } else {
        console.log('board slug doesnt exist');
        this.router.navigate(['/board', this.boardId]);
      }
    } else {
      // Fallback: navigate to dashboard or home
      this.router.navigate(['/dashboard']);
    }
  }

  // Handle click outside the ticket detailed view to close it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.disableCloseOnOutsideClick) {
      return;
    }

    const target = event.target as HTMLElement;
    const ticketViewElement = document.getElementById('ticket-detailed-view');

    if (ticketViewElement && !ticketViewElement.contains(target)) {
      this.closeTicketView();
    }
  }

  // Prevent click events inside the component from closing it
  onTicketViewClick(event: MouseEvent): void {
    event.stopPropagation();
  }

// Handle click on the ticket name input when not editing
onTicketNameClick(event: MouseEvent): void {
  if (!this.isEditingName) {
    event.stopPropagation();
    this.enableNameEditing();
  }
}

// Edit Ticket Name
enableNameEditing(): void {
  this.isEditingName = true;

    const inputElement = document.getElementById('ticket-name-input') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
      inputElement.select();
    }
}

  saveTicketName(): void {
    if (this.newName.trim() !== '') {
      const updateRequest: UpdateTicketRequest = {
        id: this.ticketDetails.id,
        name: this.utilsService.cleanStringWhiteSpace(this.newName),
        description: this.ticketDetails.description,
        colorId: this.ticketDetails.colorId,
      };
      this.ticketDetails.name = this.utilsService.cleanStringWhiteSpace(this.newName);
      this.newName = this.ticketDetails.name
      this.ticketService.updateTicket(updateRequest).subscribe({
        next: () => {
          this.ticketDetails.name = this.utilsService.cleanStringWhiteSpace(this.newName);
          this.isEditingName = false;
          this.ticketUpdateService.emitTicketUpdate(this.ticketDetails);
        },
        error: (error) => {
          console.error('Failed to update ticket name:', error);
        },
      });
    } else {
      this.ticketDetails.name = this.utilsService.cleanStringWhiteSpace(this.ticketDetails.name)
    }
  }

  cancelNameEditing(): void {
    this.isEditingName = false;
    this.newName = this.utilsService.cleanStringWhiteSpace(this.ticketDetails.name);
  }

  // Edit Ticket Description
  enableDescriptionEditing(event: MouseEvent): void {
    event.stopPropagation();
    this.isEditingDescription = true;
  }

  saveTicketDescription(): void {
    const updateRequest: UpdateTicketRequest = {
      id: this.ticketDetails.id,
      name: this.ticketDetails.name,
      description: this.newDescription,
      colorId: this.ticketDetails.colorId,
    };
    this.isEditingDescription = false;
    this.ticketService.updateTicket(updateRequest).subscribe({
      next: () => {
        this.ticketDetails.description = this.newDescription;
        this.ticketUpdateService.emitTicketUpdate(this.ticketDetails);
      },
      error: (error) => {
        console.error('Failed to update ticket description:', error);
      },
    });
  }

  cancelDescriptionEditing(): void {
    this.isEditingDescription = false;
    this.newDescription = this.ticketDetails.description;
  }

  // Open Move to Different List using OverlayService
  openMoveToListSubmenu(event: Event): void {
    event.stopPropagation();
    this.disableCloseOnOutsideClick = true;
    // Fetch all lists
    if (this.boardId) {
      this.listService.getAllLists(this.boardId).subscribe({
        next: (listsData: GetAllListsDetailsResponse[]) => {
          console.log(listsData);
          this.lists = listsData;
          const submenuData: SubmenuInputTransfer = {
            type: 'dropdown-submenu',
            purpose: 'moveToList',
            payload: {
              title: 'Move to different list',
              dropdownInputLabel: 'Select destination list',
              dropdownItems: this.lists.map((list) => ({
                id: list.id,
                name: list.name,
              })),
              dropdownPlaceholder: 'Select a list...',
              buttonText: 'Move',
            } as DropdownSubmenuInput,
          };
          const originElement = event.target as HTMLElement;
          if (originElement) {
            this.overlayService.openSubmenuOverlay(
              originElement,
              submenuData,
              (output) => {
                this.handleMoveToListAction(output);
              }
            );
          }
        },
        error: (error) => {
          console.error('Failed to fetch lists:', error);
        },
      });
    } else {
      console.error('Board ID is not available');
    }
  }

  handleMoveToListAction(output: SubmenuOutputTransfer): void {
    console.log('Move to list submenu action output:', output);
    if (output.type === 'dropdown-submenu' && output.payload) {
      const { id, name } = output.payload as DropdownSubmenuOutput;
      const request: UpdateTicketPositionRequest = {
        id: this.ticketDetails.id,
        listId: id,
        // newPosition is omitted to default to 1
      };
      this.ticketService.updateTicketPosition(request).subscribe({
        next: () => {
          this.ticketDetails.listId = id;
          this.ticketDetails.listName = name;
          this.ticketUpdateService.emitTicketUpdate(this.ticketDetails);
          console.log(`Ticket moved to list ${name}`);
        },
        error: (error) => {
          console.error('Failed to move ticket:', error);
        },
      });
    }
  }

  // Open Change Cover Color using OverlayService
  openChangeCoverColorSubmenu(event: Event): void {
    event.stopPropagation();
    this.disableCloseOnOutsideClick = true;
    const submenuData: SubmenuInputTransfer = {
      type: 'color-selection-submenu',
      purpose: 'changeCoverColor',
      payload: {
        title: 'Choose Cover',
        colorId: this.ticketDetails.colorId,
        buttonText: 'Done',
      } as ColorSelectionSubmenuInput,
    };
    const originElement = event.target as HTMLElement;
    if (originElement) {
      this.overlayService.openSubmenuOverlay(
        originElement,
        submenuData,
        (output) => {
          this.handleChangeCoverColorAction(output);
        }
      );
    }
  }

  handleChangeCoverColorAction(output: SubmenuOutputTransfer): void {
    console.log('Change cover color submenu action output:', output);
    if (output.type === 'color-selection-submenu' && output.payload) {
      const { colorId } = output.payload as ColorSelectionSubmenuOutput;
      const updateRequest: UpdateTicketRequest = {
        id: this.ticketDetails.id,
        name: this.ticketDetails.name,
        description: this.ticketDetails.description,
        colorId: colorId,
      };
      this.ticketService.updateTicket(updateRequest).subscribe({
        next: () => {
          this.ticketDetails.colorId = colorId;
          if (colorId) {
            this.colorHex = this.getColorHex(colorId);
          } else {
            this.colorHex = '#CCCCCC';
          }
          this.ticketUpdateService.emitTicketUpdate(this.ticketDetails);
          console.log(`Ticket cover color changed to ${colorId}`);
        },
        error: (error) => {
          console.error('Failed to update ticket color:', error);
        },
      });
    }
  }

  // Open Delete Confirmation using OverlayService
  openDeleteConfirmationSubmenu(event: Event): void {
    event.stopPropagation();
    this.disableCloseOnOutsideClick = true;
    const submenuData: SubmenuInputTransfer = {
      type: 'confirmation-submenu',
      purpose: 'deleteTicket',
      payload: {
        title: 'Confirmation',
        confirmationMessage: `Are you sure you want to delete "${this.ticketDetails.name}"?`,
        buttonText: 'Delete',
      } as ConfirmationSubmenuInput,
    };
    const originElement = event.target as HTMLElement;
    if (originElement) {
      this.overlayService.openSubmenuOverlay(
        originElement,
        submenuData,
        (output) => {
          this.handleDeleteConfirmationAction(output);
        }
      );
    }
  }

  handleDeleteConfirmationAction(output: SubmenuOutputTransfer): void {
    console.log('Delete confirmation submenu action output:', output);
    if (output.type === 'confirmation-submenu' && output.payload) {
      const { confirmationStatus } =
        output.payload as ConfirmationSubmenuOutput;
      if (confirmationStatus) {
        this.ticketService.deleteTicket(this.ticketDetails.id).subscribe({
          next: () => {
            // Close the ticket view and possibly refresh the board
            this.ticketUpdateService.emitTicketUpdate({
              ...this.ticketDetails,
              deleted: true,
            } as TicketInput);
            this.closeTicketView();
            console.log(`Ticket ${this.ticketDetails.name} deleted`);
          },
          error: (error) => {
            console.error('Failed to delete ticket:', error);
          },
        });
      }
    }
  }

  // Handle retry loading ticket
  retryFetchTicket(): void {
    this.fetchTicketDetails();
  }
}
