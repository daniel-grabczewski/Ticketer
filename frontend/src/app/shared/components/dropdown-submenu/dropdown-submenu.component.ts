import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropdownSubmenuInput,
  DropdownSubmenuOutput,
} from '../../models/submenuInputOutput.model';
import { XButtonComponent } from '../x-button/x-button.component';
import { X_SCALE_VALUE } from '@constants';

@Component({
  selector: 'app-dropdown-submenu',
  templateUrl: './dropdown-submenu.component.html',
  styleUrls: ['./dropdown-submenu.component.scss'],
  imports: [CommonModule, FormsModule, XButtonComponent]
})
export class DropdownSubmenuComponent implements DropdownSubmenuInput, AfterViewInit {
  // Inputs matching DropdownSubmenuInput
  @Input() title: string = '';
  @Input() dropdownInputLabel: string = '';
  @Input() dropdownItems: Array<{ id: string; name: string }> = [];
  @Input() dropdownPlaceholder: string = '';
  @Input() buttonText: string = '';

  // Outputs for DropdownSubmenuOutput
  @Output() menuAction = new EventEmitter<DropdownSubmenuOutput>();
  @Output() close = new EventEmitter<void>();

  xScale = X_SCALE_VALUE;

  // Component State
  selectedOption: { id: string; name: string } | null = null;

  // Maximum character limit for option names.
  private readonly MAX_CHAR_LIMIT = 30;

  // Reference to the container element (for focusing).
  @ViewChild('menuContainer') menuContainer!: ElementRef<HTMLElement>;

  // Process a string to limit its characters.
  processString(value: string): string {
    if (!value) return '';
    if (value.length > this.MAX_CHAR_LIMIT) {
      return value.substring(0, this.MAX_CHAR_LIMIT) + '...';
    }
    return value;
  }

  // After view initialization, focus the container to capture key events.
  ngAfterViewInit() {
    if (this.menuContainer) {
      this.menuContainer.nativeElement.focus();
    }
  }

  // Handle action button (or Enter key) click.
  onActionClicked() {
    // Only perform the action if an option is selected.
    if (!this.selectedOption) {
      return;
    }
    this.menuAction.emit(this.selectedOption);
    this.close.emit();
  }

  // Handle close button click.
  onCloseClicked() {
    this.close.emit();
  }

  // Listen for document keydown events. If Escape is pressed, close the submenu.
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onCloseClicked();
    }
  }
}
