import { Component, EventEmitter, Output } from '@angular/core';
import { OverlayService } from '../../../core/services/overlay.service';

@Component({
  selector: 'app-test-menu',
  standalone: true,
  templateUrl: './test-menu.component.html',
  styleUrls: ['./test-menu.component.scss'],
})
export class TestMenuComponent {
  @Output() closeMenu = new EventEmitter<void>();

  constructor(private OverlayService: OverlayService) {}

  onCloseClicked() {
    this.closeMenu.emit();
  }
  /*
  // Updated method to handle the submenu button click safely
  onSubmenuButtonClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target) {
      this.verlayService.openSubmenuOverlay(target);
    } else {
      console.error('Error: Event target is not an HTMLElement.');
    }
  }
    */
}
