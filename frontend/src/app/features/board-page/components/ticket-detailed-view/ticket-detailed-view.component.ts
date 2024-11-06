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
import { DropdownSubmenuComponent } from '../../../../shared/components/dropdown-submenu/dropdown-submenu.component';
import { ColorSelectionSubmenuComponent } from '../../../../shared/components/color-selection-submenu/color-selection-submenu.component';
import { ConfirmationSubmenuComponent } from '../../../../shared/components/confirmation-submenu/confirmation-submenu.component';
import { FormsModule } from '@angular/forms';
import {
  DropdownSubmenuInput,
  DropdownSubmenuOutput,
  ColorSelectionSubmenuInput,
  ColorSelectionSubmenuOutput,
  ConfirmationSubmenuInput,
  ConfirmationSubmenuOutput,
} from '../../../../shared/models/submenuInputOutput.model';
import { TicketUpdateService } from '../../../../core/services/ticket-update.service';
import { TicketInput } from '../../../../shared/models/uniqueComponentInputOutput.model';

@Component({
  selector: 'app-ticket-detailed-view',
  templateUrl: './ticket-detailed-view.component.html',
  styleUrls: ['./ticket-detailed-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownSubmenuComponent,
    ColorSelectionSubmenuComponent,
    ConfirmationSubmenuComponent,
  ],
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

  // Submenu states
  showDropdownSubmenu: boolean = false;
  dropdownSubmenuConfig!: DropdownSubmenuInput;

  showColorSelectionSubmenu: boolean = false;
  colorSelectionSubmenuConfig!: ColorSelectionSubmenuInput;

  showConfirmationSubmenu: boolean = false;
  confirmationSubmenuConfig!: ConfirmationSubmenuInput;

  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private listService: ListService,
    private colorService: ColorService,
    private ticketUpdateService: TicketUpdateService
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
    const target = event.target as HTMLElement;
    const ticketViewElement = document.getElementById('ticket-detailed-view');

    if (
      ticketViewElement &&
      !ticketViewElement.contains(target) &&
      !this.showDropdownSubmenu &&
      !this.showColorSelectionSubmenu &&
      !this.showConfirmationSubmenu
    ) {
      this.closeTicketView();
    }
  }

  // Prevent click events inside the component from closing it
  onTicketViewClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  // Edit Ticket Name
  enableNameEditing(event: MouseEvent): void {
    event.stopPropagation();
    this.isEditingName = true;
  }

  saveTicketName(): void {
    if (this.newName.trim() !== '') {
      const updateRequest: UpdateTicketRequest = {
        id: this.ticketDetails.id,
        name: this.newName.trim(),
        description: this.ticketDetails.description,
        colorId: this.ticketDetails.colorId,
      };
      this.ticketService.updateTicket(updateRequest).subscribe({
        next: () => {
          this.ticketDetails.name = this.newName.trim();
          this.isEditingName = false;
          this.ticketUpdateService.emitTicketUpdate(this.ticketDetails);
        },
        error: (error) => {
          console.error('Failed to update ticket name:', error);
        },
      });
    }
  }

  cancelNameEditing(): void {
    this.isEditingName = false;
    this.newName = this.ticketDetails.name;
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
    this.ticketService.updateTicket(updateRequest).subscribe({
      next: () => {
        this.ticketDetails.description = this.newDescription;
        this.isEditingDescription = false;
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

  // Open Move to Different List Submenu
  openMoveToListSubmenu(): void {
    this.showDropdownSubmenu = true;
    // Fetch all lists
    if (this.boardId) {
      this.listService.getAllLists(this.boardId).subscribe({
        next: (listsData: GetAllListsDetailsResponse[]) => {
          console.log(listsData);
          this.lists = listsData;
          this.dropdownSubmenuConfig = {
            title: 'Move to different list',
            dropdownInputLabel: 'Select destination list',
            dropdownItems: this.lists.map((list) => ({
              id: list.id,
              name: list.name,
            })),
            dropdownPlaceholder: 'Select a list...',
            buttonText: 'Move',
          };
        },
        error: (error) => {
          console.error('Failed to fetch lists:', error);
        },
      });
    } else {
      console.error('Board ID is not available');
    }
  }

  handleMoveToListAction(output: DropdownSubmenuOutput): void {
    const request: UpdateTicketPositionRequest = {
      id: this.ticketDetails.id,
      listId: output.id,
      // newPosition is omitted to default to 1
    };
    this.ticketService.updateTicketPosition(request).subscribe({
      next: () => {
        this.ticketDetails.listId = output.id;
        this.ticketDetails.listName = output.name;
        this.showDropdownSubmenu = false;
        this.ticketUpdateService.emitTicketUpdate(this.ticketDetails);
      },
      error: (error) => {
        console.error('Failed to move ticket:', error);
      },
    });
  }

  closeDropdownSubmenu(): void {
    this.showDropdownSubmenu = false;
  }

  // Open Change Cover Color Submenu
  openChangeCoverColorSubmenu(): void {
    this.showColorSelectionSubmenu = true;
    this.colorSelectionSubmenuConfig = {
      title: 'Choose Cover',
      colorId: this.ticketDetails.colorId,
      buttonText: 'Done',
    };
  }

  handleChangeCoverColorAction(output: ColorSelectionSubmenuOutput): void {
    const updateRequest: UpdateTicketRequest = {
      id: this.ticketDetails.id,
      name: this.ticketDetails.name,
      description: this.ticketDetails.description,
      colorId: output.colorId,
    };
    this.ticketService.updateTicket(updateRequest).subscribe({
      next: () => {
        this.ticketDetails.colorId = output.colorId;
        if (output.colorId) {
          this.colorHex = this.getColorHex(output.colorId);
        } else {
          this.colorHex = '#CCCCCC';
        }
        this.showColorSelectionSubmenu = false;
        this.ticketUpdateService.emitTicketUpdate(this.ticketDetails);
      },
      error: (error) => {
        console.error('Failed to update ticket color:', error);
      },
    });
  }

  closeColorSelectionSubmenu(): void {
    this.showColorSelectionSubmenu = false;
  }

  // Open Delete Confirmation Submenu
  openDeleteConfirmationSubmenu(): void {
    this.showConfirmationSubmenu = true;
    this.confirmationSubmenuConfig = {
      title: 'Confirmation',
      confirmationMessage: `Are you sure you want to delete "${this.ticketDetails.name}"?`,
      buttonText: 'Delete',
    };
  }

  handleDeleteConfirmationAction(output: ConfirmationSubmenuOutput): void {
    if (output.confirmationStatus) {
      this.ticketService.deleteTicket(this.ticketDetails.id).subscribe({
        next: () => {
          // Close the ticket view and possibly refresh the board
          this.ticketUpdateService.emitTicketUpdate({
            ...this.ticketDetails,
            deleted: true,
          } as TicketInput);
          this.closeTicketView();
        },
        error: (error) => {
          console.error('Failed to delete ticket:', error);
        },
      });
    }
    this.showConfirmationSubmenu = false;
  }

  closeConfirmationSubmenu(): void {
    this.showConfirmationSubmenu = false;
  }

  // Handle retry loading ticket
  retryFetchTicket(): void {
    this.fetchTicketDetails();
  }
}
