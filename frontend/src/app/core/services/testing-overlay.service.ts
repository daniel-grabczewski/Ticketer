import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { TestMenuComponent } from '../../shared/components/test-menu/test-menu.component';
import { TextInputSubmenuComponent } from '../../shared/components/text-input-submenu/text-input-submenu.component';
import { ConfirmationSubmenuComponent } from '../../shared/components/confirmation-submenu/confirmation-submenu.component';
import { BackgroundSelectionSubmenuComponent } from '../../shared/components/background-selection-submenu/background-selection-submenu.component';
import { GenerateBoardSubmenuComponent } from '../../shared/components/generate-board-submenu/generate-board-submenu.component';
import { ColorSelectionSubmenuComponent } from '../../shared/components/color-selection-submenu/color-selection-submenu.component';
import { DropdownSubmenuComponent } from '../../shared/components/dropdown-submenu/dropdown-submenu.component';
import {
  SubmenuInputTransfer,
  SubmenuOutputTransfer,
} from '../../shared/models/menu.model';
import {
  SubmenuTypes,
  SubmenuInput,
} from '../../shared/models/submenuInputOutput.model';
import { CreateBoardItemSubmenuComponent } from '../../shared/components/create-board-item-submenu/create-board-item-submenu.component';

@Injectable({
  providedIn: 'root',
})
export class TestingOverlayService {
  private overlayRef: OverlayRef | null = null;
  private submenuOverlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay, private injector: Injector) {}

  // Map to link type strings to component classes
  private componentMap: { [key in SubmenuTypes]: ComponentType<any> } = {
    'text-input-submenu': TextInputSubmenuComponent,
    'confirmation-submenu': ConfirmationSubmenuComponent,
    'background-selection-submenu': BackgroundSelectionSubmenuComponent,
    'generate-board-submenu': GenerateBoardSubmenuComponent,
    'color-selection-submenu': ColorSelectionSubmenuComponent,
    'dropdown-submenu': DropdownSubmenuComponent,
    'create-board-item-submenu': CreateBoardItemSubmenuComponent,
  };

  // Method to open the TestMenuComponent as an overlay
  openOverlay(origin: HTMLElement) {
    if (this.overlayRef) {
      this.closeOverlay();
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
      ]);

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
    });

    const portal = new ComponentPortal(TestMenuComponent);
    const componentRef = this.overlayRef.attach(portal);

    // Close overlay when the backdrop is clicked
    this.overlayRef.backdropClick().subscribe(() => this.closeOverlay());

    // Listen for the close event emitted by the TestMenuComponent
    componentRef.instance.closeMenu.subscribe(() => this.closeOverlay());
  }

  // Method to open a submenu overlay based on the type string
  openSubmenuOverlay(origin: HTMLElement, submenuData: SubmenuInputTransfer) {
    if (this.submenuOverlayRef) {
      this.closeSubmenuOverlay();
    }

    const componentType = this.componentMap[submenuData.type];
    if (!componentType) {
      console.error('No component found for type:', submenuData.type);
      return;
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
      ]);

    this.submenuOverlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
    });

    const portal = new ComponentPortal(componentType);
    const componentRef = this.submenuOverlayRef.attach(portal);

    // Type guard to ensure proper type assignment
    if (submenuData.payload) {
      this.assignInputsToComponent(componentRef.instance, submenuData.payload);
    }

    // Close submenu overlay when the backdrop is clicked
    this.submenuOverlayRef
      .backdropClick()
      .subscribe(() => this.closeSubmenuOverlay());

    // Listen for events emitted by the submenu instance
    if (
      this.isInstanceWithEventEmitter(componentRef.instance, 'closeSubmenu')
    ) {
      componentRef.instance['closeSubmenu'].subscribe(() =>
        this.closeSubmenuOverlay()
      );
    }

    // Menu action event handling
    if (this.isInstanceWithEventEmitter(componentRef.instance, 'menuAction')) {
      componentRef.instance['menuAction'].subscribe((output: SubmenuInput) => {
        console.log('Submenu action emitted:', output);
        // Optionally, handle or propagate the action event here
      });
    }
  }

  private assignInputsToComponent(instance: any, payload: SubmenuInput) {
    Object.keys(payload).forEach((key) => {
      if (key in instance) {
        instance[key] = payload[key as keyof SubmenuInput];
      }
    });
  }

  private isInstanceWithEventEmitter(
    instance: any,
    propName: string
  ): instance is { [key: string]: any } {
    return instance && typeof instance[propName]?.subscribe === 'function';
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

  // Method to close all overlays (optional for comprehensive cleanup)
  closeAllOverlays() {
    this.closeOverlay();
    this.closeSubmenuOverlay();
  }
}
