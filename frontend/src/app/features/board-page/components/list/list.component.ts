import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DragDropModule, CdkDragDrop, CdkDrag } from '@angular/cdk/drag-drop'
import { TicketComponent } from '../ticket/ticket.component'
import { GetBoardFullDetailsResponse } from '../../../../shared/models/board.model'
import { GetColorsResponse } from '../../../../shared/models/color.model'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [CommonModule, DragDropModule, TicketComponent]
})
export class ListComponent {
  @Input() listData!: GetBoardFullDetailsResponse['lists'][0] // The specific list data structure
  @Input() colorMap!: Record<number, string> // Map of color IDs to HEX values

  @Output() listPositionChanged = new EventEmitter<{ id: string, newPosition: number }>()
  @Output() ticketPositionChanged = new EventEmitter<{ ticketId: string, listId: string, newPosition: number }>()
  @Output() listRenamed = new EventEmitter<{ id: string, newName: string }>()
  @Output() listDuplicated = new EventEmitter<string>()
  @Output() listDeleted = new EventEmitter<string>()
  @Output() ticketCreated = new EventEmitter<{ listId: string, name: string }>()

  // Handler for reordering tickets within the list
  onTicketDrop(event: CdkDragDrop<any[]>) {
    const previousIndex = event.previousIndex
    const currentIndex = event.currentIndex
    const ticketId = this.listData.tickets[previousIndex].id

    if (previousIndex !== currentIndex) {
      this.ticketPositionChanged.emit({ 
        ticketId, 
        listId: this.listData.id, 
        newPosition: currentIndex 
      })
    }
  }

  // Placeholder for renaming the list title
  onRenameList(newName: string) {
    this.listRenamed.emit({ id: this.listData.id, newName })
  }
}
