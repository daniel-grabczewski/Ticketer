// ticket.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  standalone: true,
  imports: [CommonModule, DragDropModule],
})
export class TicketComponent implements OnInit {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() description: string = '';
  @Input() position: number = 0;
  @Input() colorId: number | null = null;
  @Input() colorMap: { [key: number]: string } = {};

  colorHex: string = ''; // Stores the hex color based on colorMap and colorId

  ngOnInit(): void {
    if (this.colorId !== null && this.colorMap[this.colorId]) {
      this.colorHex = this.colorMap[this.colorId];
    }
  }
}
