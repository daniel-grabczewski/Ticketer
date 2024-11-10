import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-test-submenu',
  standalone: true,
  templateUrl: './test-submenu.component.html',
  styleUrls: ['./test-submenu.component.scss']
})
export class TestSubmenuComponent {
  // Output to emit an event for closing the submenu
  @Output() closeSubmenu = new EventEmitter<void>();

  // Method to emit the close event
  onCloseClicked() {
    this.closeSubmenu.emit();
  }
}
