// list.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Added FormsModule
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TicketComponent } from '../ticket/ticket.component';
import { TicketInput } from '../../../../shared/models/uniqueComponentInputOutput.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, TicketComponent],
})
export class ListComponent {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() position: number = 0;
  @Input() tickets: TicketInput[] = [];
  @Input() colorMap: { [key: number]: string } = {};

  @Output() ticketPositionChanged = new EventEmitter<{ ticketId: string; listId: string; newPosition: number }>();
  @Output() listRenamed = new EventEmitter<{ id: string; newName: string }>();
  @Output() listDuplicated = new EventEmitter<string>();
  @Output() listDeleted = new EventEmitter<string>();
  @Output() ticketCreated = new EventEmitter<{ listId: string; name: string }>();

  // Handler for reordering tickets within the list
  onTicketDrop(event: CdkDragDrop<TicketInput[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.tickets, event.previousIndex, event.currentIndex);
      const ticket = this.tickets[event.currentIndex];
      this.ticketPositionChanged.emit({
        ticketId: ticket.id,
        listId: this.id,
        newPosition: event.currentIndex,
      });
    }
  }

  // Placeholder for renaming the list title
  onRenameList(newName: string): void {
    this.listRenamed.emit({ id: this.id, newName });
  }
}
