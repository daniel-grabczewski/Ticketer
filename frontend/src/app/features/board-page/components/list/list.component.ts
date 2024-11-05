import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TicketComponent } from '../ticket/ticket.component';
import { TicketInput } from '../../../../shared/models/uniqueComponentInputOutput.model';
import { TicketService } from '../../../../core/services/ticket.service';
import { UpdateTicketPositionRequest } from '../../../../shared/models/ticket.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, TicketComponent],
})
export class ListComponent implements OnInit {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() position: number = 0;
  @Input() tickets: TicketInput[] = [];
  @Input() colorMap: { [key: number]: string } = {};
  @Input() connectedDropLists: string[] = [];

  @Output() ticketPositionChanged = new EventEmitter<{
    ticketId: string;
    oldListId: string;
    newListId: string;
    newPosition: number;
  }>();
  @Output() listRenamed = new EventEmitter<{ id: string; newName: string }>();
  @Output() listDuplicated = new EventEmitter<string>();
  @Output() listDeleted = new EventEmitter<string>();
  @Output() ticketCreated = new EventEmitter<{ listId: string; name: string }>();

  cdkDropListId!: string;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    // Set a unique cdkDropListId
    this.cdkDropListId = 'cdk-drop-list-' + this.id;
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
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

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
          console.log(`Ticket ${request.id} position updated to ${request.newPosition} in list ${request.listId}`);
        },
        error: (error) => {
          console.error(`Failed to update position for ticket ${request.id}:`, error);
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
      const oldListId = event.previousContainer.id.replace('cdk-drop-list-', '');
      const newListId = this.id;

      const request: UpdateTicketPositionRequest = {
        id: ticket.id,
        listId: newListId,
        newPosition: ticket.position,
      };

      this.ticketService.updateTicketPosition(request).subscribe({
        next: () => {
          console.log(`Ticket ${request.id} moved to list ${request.listId} at position ${request.newPosition}`);
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

  // Placeholder for renaming the list title
  onRenameList(newName: string): void {
    this.listRenamed.emit({ id: this.id, newName });
  }
}
