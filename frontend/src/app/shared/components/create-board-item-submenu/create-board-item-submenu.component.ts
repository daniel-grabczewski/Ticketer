import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
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
  imports: [CommonModule, FormsModule, XButtonComponent]
})
export class CreateBoardItemSubmenuComponent implements AfterViewInit {
  // Inputs based on CreateBoardItemSubmenuInput
  @Input() placeholder: string = '';
  @Input() buttonText: string = '';
  @Input() isHorizontalPadding: boolean = false;

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
  horizontalPadding: string = 'var(--list-horizontal-padding)';
  private holding = false;

  // Grab a reference to the input element
  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;

  constructor(private elementRef: ElementRef) {}

  // Prevent closing immediately due to the outside click mechanism
  ngOnInit() {
    this.justOpened = true;
    setTimeout(() => (this.justOpened = false), 0);
  }

  // After the view has initialized, focus the input.
  ngAfterViewInit() {
    if (this.inputField) {
      this.inputField.nativeElement.focus();
    }
  }

  getPadding(): string {
    if (this.isHorizontalPadding) {
      return `0 ${this.horizontalPadding}`;
    }
    return '0 0';
  }

  // Handle action button click
  onActionClicked() {
    // If input is empty, simply close the submenu.
    if (this.textInputValue === '') {
      this.close.emit();
    } else {
      this.menuAction.emit({ text: this.textInputValue });
      this.close.emit();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
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

  // New: Listen for the Escape key to close the submenu
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onCloseClicked();
    }
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
