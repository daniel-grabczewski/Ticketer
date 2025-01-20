import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConfirmationSubmenuInput,
  ConfirmationSubmenuOutput,
} from '../../models/submenuInputOutput.model';
import { XButtonComponent } from '../x-button/x-button.component';
import { X_SCALE_VALUE } from '@constants';

@Component({
  selector: 'app-confirmation-submenu',
  templateUrl: './confirmation-submenu.component.html',
  styleUrls: ['./confirmation-submenu.component.scss'],
  imports: [CommonModule, XButtonComponent]
})
export class ConfirmationSubmenuComponent implements ConfirmationSubmenuInput, AfterViewInit {
  // Inputs matching ConfirmationSubmenuInput
  @Input() title: string = '';
  @Input() confirmationMessage: string = '';
  @Input() buttonText: string = '';

  // Outputs for ConfirmationSubmenuOutput
  @Output() menuAction = new EventEmitter<ConfirmationSubmenuOutput>();
  @Output() close = new EventEmitter<void>();

  xScale = X_SCALE_VALUE;

  // Reference to the container element to set focus on init.
  @ViewChild('menuContainer') menuContainer!: ElementRef<HTMLElement>;

  // After the view initializes, set focus on the container.
  ngAfterViewInit() {
    if (this.menuContainer) {
      this.menuContainer.nativeElement.focus();
    }
  }

  // Handle action button (or Enter key) click.
  onActionClicked() {
    this.menuAction.emit({ confirmationStatus: true });
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
