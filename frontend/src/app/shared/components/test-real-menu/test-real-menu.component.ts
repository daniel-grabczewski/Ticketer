import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MenuConfig,
  SubmenuInputTransfer,
  SubmenuOutputTransfer,
} from '../../models/menu.model';
import { SubmenuTypes } from '../../models/submenuInputOutput.model';
import { OverlayService } from '../../../core/services/overlay.service';
import {
  TextInputSubmenuInput,
  ConfirmationSubmenuInput,
  BackgroundSelectionSubmenuInput,
  GenerateBoardSubmenuInput,
  ColorSelectionSubmenuInput,
  DropdownSubmenuInput,
  SubmenuOutput,
} from '../../models/submenuInputOutput.model';
import { TextInputSubmenuComponent } from '../text-input-submenu/text-input-submenu.component';
import { ConfirmationSubmenuComponent } from '../confirmation-submenu/confirmation-submenu.component';
import { BackgroundSelectionSubmenuComponent } from '../background-selection-submenu/background-selection-submenu.component';
import { GenerateBoardSubmenuComponent } from '../generate-board-submenu/generate-board-submenu.component';
import { ColorSelectionSubmenuComponent } from '../color-selection-submenu/color-selection-submenu.component';
import { DropdownSubmenuComponent } from '../dropdown-submenu/dropdown-submenu.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { XButtonComponent } from '../x-button/x-button.component';
import { X_SCALE_VALUE } from '@constants';

@Component({
  selector: 'app-test-real-menu',
  templateUrl: './test-real-menu.component.html',
  styleUrls: ['./test-real-menu.component.scss'],
  imports: [
    CommonModule,
    TextInputSubmenuComponent,
    ConfirmationSubmenuComponent,
    BackgroundSelectionSubmenuComponent,
    GenerateBoardSubmenuComponent,
    ColorSelectionSubmenuComponent,
    DropdownSubmenuComponent,
    XButtonComponent,
  ],
})
export class TestRealMenuComponent implements OnInit {
  @Input() menuConfig: MenuConfig = { title: '', submenus: [] };
  @Input() orderBias: SubmenuTypes[] = ['confirmation-submenu'];
  @Output() menuAction = new EventEmitter<SubmenuOutputTransfer>();
  @Output() close = new EventEmitter<void>();

  rearrangedSubmenus: { buttonText: string; submenu: SubmenuInputTransfer }[] = [];

  isMobile: boolean = false;
  xScale = X_SCALE_VALUE;

  constructor(
    private elementRef: ElementRef,
    private overlayService: OverlayService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.isMobile = this.breakpointObserver.isMatched('(max-width: 790px)');
    this.rearrangeSubmenus();
    console.log('Initialized TestRealMenuComponent with config:', this.menuConfig);
  }

  rearrangeSubmenus() {
    const submenus = this.menuConfig.submenus as {
      buttonText: string;
      submenu: SubmenuInputTransfer;
    }[];
    const submenusNotInBias: {
      buttonText: string;
      submenu: SubmenuInputTransfer;
    }[] = [];
    const submenusInBias: {
      [type: string]: { buttonText: string; submenu: SubmenuInputTransfer }[];
    } = {};

    for (const type of this.orderBias) {
      submenusInBias[type] = [];
    }

    for (const submenuItem of submenus) {
      const type = submenuItem.submenu.type;
      if (this.orderBias.includes(type)) {
        submenusInBias[type].push(submenuItem);
      } else {
        submenusNotInBias.push(submenuItem);
      }
    }

    this.rearrangedSubmenus = [...submenusNotInBias];
    for (const type of this.orderBias) {
      this.rearrangedSubmenus.push(...submenusInBias[type]);
    }
    console.log('Rearranged submenus:', this.rearrangedSubmenus);
  }

  handleSubmenuClick(index: number, event: Event) {
    const target = event.target as HTMLElement | null;
    if (target) {
      this.openSubmenu(index, target);
    } else {
      console.error('Error: Event target is not an HTMLElement.');
    }
    event.stopPropagation();
  }

  openSubmenu(index: number, originElement: HTMLElement) {
    const submenuItem = this.rearrangedSubmenus[index];
    const submenuInput: SubmenuInputTransfer = submenuItem.submenu;
    // Provide a callback to handle submenu outputs
    this.overlayService.openSubmenuOverlay(
      originElement,
      submenuInput,
      (output) => {
        // This callback gets invoked when submenu actions occur
        this.handleSubmenuAction(output);
      },
      true // Indicate that the submenu is opened from a menu
    );
    console.log('Requested to open submenu:', submenuInput);
  }

  handleSubmenuAction(submenuOutputTransfer: SubmenuOutputTransfer) {
    console.log('Handling submenu action in TestRealMenuComponent:', submenuOutputTransfer);
    // Emit the submenu action up to the parent component that opened this menu
    this.menuAction.emit(submenuOutputTransfer);
  }

  closeMenu() {
    this.overlayService.closeAllOverlays();
    this.close.emit();
    console.log('Menu closed');
  }

  // Host listener for Escape key that only closes the main menu if no submenu overlay is open.
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      // Check if a submenu overlay is open
      if (this.overlayService.hasOpenSubmenuOverlay()) {
        // Do nothing if a submenu is currently open
        return;
      }
      this.closeMenu();
    }
  }
}
