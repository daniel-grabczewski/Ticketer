import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ColorSelectionPanelComponent } from '../color-selection-panel/color-selection-panel.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-selection-submenu',
  templateUrl: './color-selection-submenu.component.html',
  styleUrls: ['./color-selection-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, ColorSelectionPanelComponent],
})
export class ColorSelectionSubmenuComponent implements OnInit {
  // Inputs
  @Input() title: string = '';
  @Input() selectedColorId: number | null = null;
  @Input() buttonText: string = '';

  // Outputs
  @Output() menuAction = new EventEmitter<{ type: string; value: number | null }>();
  @Output() close = new EventEmitter<void>();

  // Component State
  colorId: number | null = null;

  ngOnInit() {
    // Initialize colorId with selectedColorId input
    this.colorId = this.selectedColorId;
  }

  // Handle color selection from the child component
  onColorSelected(colorId: number | null) {
    this.colorId = colorId;
  }

  // Handle action button click
  onActionClicked() {
    // Emit the menu action with the specified structure
    this.menuAction.emit({
      type: 'color-selection-submenu',
      value: this.colorId,
    });
    // Close the submenu
    this.close.emit();
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
