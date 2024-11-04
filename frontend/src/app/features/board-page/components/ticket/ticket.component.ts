import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TicketInput, TicketOutput } from '../../../../shared/models/uniqueComonentInputOutput.model'

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TicketComponent implements OnInit {
  @Input() ticketData!: TicketInput
  @Output() ticketMoved = new EventEmitter<TicketOutput>()

  colorHex: string = ''  // Stores the hex color based on colorMap and colorId

  ngOnInit() {
    // Set the hex color using colorMap if colorId exists
    if (this.ticketData.colorId !== null && this.ticketData.colorMap[this.ticketData.colorId]) {
      this.colorHex = this.ticketData.colorMap[this.ticketData.colorId]
    }
  }

  // Emit ticket move event for drag-and-drop actions
  moveTicket(targetListId: string, newPosition: number) {
    const outputData: TicketOutput = {
      id: this.ticketData.id,
      targetListId,
      newPosition
    }
    this.ticketMoved.emit(outputData)
  }
}
