import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GetColorsResponse } from '../../models/color.model';
import { ColorService } from '../../../core/services/color.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-background-selection-panel',
    imports: [CommonModule],
    templateUrl: './background-selection-panel.component.html',
    styleUrls: ['./background-selection-panel.component.scss']
})
export class BackgroundSelectionPanelComponent implements OnInit {
  @Input() selectedColorId: number | null = null; // Initial selected color ID or null for no selection
  @Output() colorSelected = new EventEmitter<number | null>(); // Emits color ID or null on selection

  colors: GetColorsResponse[] = []; // Variable to store colors

  constructor(private colorService: ColorService) {}

  ngOnInit() {
    this.colorService.getAllColors().subscribe({
      next: (data) => {
        this.colors = data; // Store the colors received from the service
      },
      error: (error) => {
        console.error('Failed to fetch colors:', error); // Handle any errors here
      },
    });
  }

  onColorClick(colorId: number) {
    if (this.selectedColorId === colorId) {
      this.selectedColorId = null; // Deselect if the same color is clicked
      this.colorSelected.emit(null);
    } else {
      this.selectedColorId = colorId; // Select a new color
      this.colorSelected.emit(colorId);
    }
  }

  // Helper method to divide colors into rows of 2
  getRows(): GetColorsResponse[][] {
    const rows: GetColorsResponse[][] = [];
    for (let i = 0; i < this.colors.length; i += 2) {
      rows.push(this.colors.slice(i, i + 2));
    }
    return rows;
  }

  // Method to get gradient style based on color ID
  getGradient(colorId: number): string {
    return `var(--gradient-${colorId})`;
  }
}
