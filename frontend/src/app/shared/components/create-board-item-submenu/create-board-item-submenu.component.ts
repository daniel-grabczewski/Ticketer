import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  CreateBoardItemSubmenuInput,
  CreateBoardItemSubmenuOutput,
} from '../../models/submenuInputOutput.model';
import { X_SCALE_VALUE } from '@constants';
import { XButtonComponent } from '../x-button/x-button.component';

@Component({
  selector: 'app-create-board-item-submenu',
  templateUrl: './create-board-item-submenu.component.html',
  styleUrls: ['./create-board-item-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, XButtonComponent],
})
export class CreateBoardItemSubmenuComponent {
  // Inputs based on CreateBoardItemSubmenuInput
  @Input() placeholder: string = '';
  @Input() buttonText: string = '';

  constructor(private elementRef: ElementRef) {}

  // Outputs
  @Output() menuAction = new EventEmitter<CreateBoardItemSubmenuOutput>();
  @Output() close = new EventEmitter<void>();
  @Output() isHoldingNonListItem = new EventEmitter<boolean>();

  private justOpened: boolean = false;
  xScale = X_SCALE_VALUE;
  // Component State
  textInputValue: string = '';
  xColor: string = 'var(--neutral-lighter)';
  xHoverColor: string = 'var(--error)';
  private holding = false;

  // Account for this component detecting initial click from parent as an outside click, closing this menu immediately upon opening with the @HostListener
  ngOnInit() {
    this.justOpened = true;
    setTimeout(() => (this.justOpened = false), 0);
  }

  // Handle action button click
  onActionClicked() {
    // Emit the menu action with the specified structure

    // If ticket name is empty, do not emit value
    if (this.textInputValue === '') {
      this.close.emit();
    } else {
      this.menuAction.emit({ text: this.textInputValue });
      // Close the submenu
      this.close.emit();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Make sure the component doesn't close on initial opening click
    if (this.justOpened) {
      return;
    }
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close.emit();
    }
  }

  @HostListener('mousedown')
  onMouseDown(): void {
    this.holding = true;
    this.isHoldingNonListItem.emit(this.holding);
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    this.holding = false;
    this.isHoldingNonListItem.emit(this.holding);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.holding = false;
    this.isHoldingNonListItem.emit(this.holding);
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
