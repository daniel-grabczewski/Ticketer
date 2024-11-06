import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TicketComponent implements OnInit {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() description: string = '';
  @Input() position: number = 0;
  @Input() colorId: number | null = null;
  @Input() colorMap: { [key: number]: string } = {};

  @Output() ticketClicked = new EventEmitter<string>();

  colorHex: string = ''; // Stores the hex color based on colorMap and colorId

  ngOnInit(): void {
    if (this.colorId !== null && this.colorMap[this.colorId]) {
      this.colorHex = this.colorMap[this.colorId];
    }
  }

  onClick(): void {
    this.ticketClicked.emit(this.id);
  }
}
