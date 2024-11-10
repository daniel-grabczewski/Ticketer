import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestMenuComponent } from '../../shared/components/test-menu/test-menu.component';
import { TestSubmenuComponent } from '../../shared/components/test-submenu/test-submenu.component';

@Injectable({
  providedIn: 'root'
})
export class TestingOverlayService {
  private overlayRef: OverlayRef | null = null;
  private submenuOverlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay, private injector: Injector) {}

  // Method to open the TestMenuComponent as an overlay
  openOverlay(origin: HTMLElement) {
    if (this.overlayRef) {
      this.closeOverlay();
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(origin)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }
      ]);

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy
    });

    const portal = new ComponentPortal(TestMenuComponent);
    const componentRef = this.overlayRef.attach(portal);

    // Close overlay when the backdrop is clicked
    this.overlayRef.backdropClick().subscribe(() => this.closeOverlay());

    // Listen for the close event emitted by the TestMenuComponent
    componentRef.instance.closeMenu.subscribe(() => this.closeOverlay());
  }

  // Method to open the TestSubmenuComponent as an overlay
  openSubmenuOverlay(origin: HTMLElement) {
    if (this.submenuOverlayRef) {
      this.closeSubmenuOverlay();
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(origin)
      .withPositions([
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' }
      ]);

    this.submenuOverlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy
    });

    const portal = new ComponentPortal(TestSubmenuComponent);
    const componentRef = this.submenuOverlayRef.attach(portal);

    // Close submenu overlay when the backdrop is clicked
    this.submenuOverlayRef.backdropClick().subscribe(() => this.closeSubmenuOverlay());

    // Listen for the close event emitted by the TestSubmenuComponent
    componentRef.instance.closeSubmenu.subscribe(() => this.closeSubmenuOverlay());
  }

  // Method to close the main overlay
  closeOverlay() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }

  // Method to close the submenu overlay
  closeSubmenuOverlay() {
    if (this.submenuOverlayRef) {
      this.submenuOverlayRef.detach();
      this.submenuOverlayRef = null;
    }
  }
}
