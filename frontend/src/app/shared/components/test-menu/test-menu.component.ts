import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-test-menu',
  standalone: true,
  templateUrl: './test-menu.component.html',
  styleUrls: ['./test-menu.component.scss']
})
export class TestMenuComponent {
  // Output to emit an event for closing the menu
  @Output() closeMenu = new EventEmitter<void>();

  // Method to emit the close event
  onCloseClicked() {
    this.closeMenu.emit();
  }
}
