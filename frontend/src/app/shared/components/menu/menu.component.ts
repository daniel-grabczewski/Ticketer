import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MenuConfig,
  SubmenuTransfer,
} from '../../models/menu.model';
import { SubmenuTypes } from '../../models/submenuInputOutput.model';
import {
  SubmenuInput,
  SubmenuOutput,
  TextInputSubmenuInput,
  ConfirmationSubmenuInput,
  BackgroundSelectionSubmenuInput,
  GenerateBoardSubmenuInput,
  ColorSelectionSubmenuInput,
  DropdownSubmenuInput,
} from '../../models/submenuInputOutput.model';
import { TextInputSubmenuComponent } from '../text-input-submenu/text-input-submenu.component';
import { ConfirmationSubmenuComponent } from '../confirmation-submenu/confirmation-submenu.component';
import { BackgroundSelectionSubmenuComponent } from '../background-selection-submenu/background-selection-submenu.component';
import { GenerateBoardSubmenuComponent } from '../generate-board-submenu/generate-board-submenu.component';
import { ColorSelectionSubmenuComponent } from '../color-selection-submenu/color-selection-submenu.component';
import { DropdownSubmenuComponent } from '../dropdown-submenu/dropdown-submenu.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TextInputSubmenuComponent,
    ConfirmationSubmenuComponent,
    BackgroundSelectionSubmenuComponent,
    GenerateBoardSubmenuComponent,
    ColorSelectionSubmenuComponent,
    DropdownSubmenuComponent,
  ],
})
export class MenuComponent {
  @Input() menuConfig: MenuConfig = { submenus: [] };
  @Input() orderBias: SubmenuTypes[] = ['confirmation-submenu']; // Default order bias
  @Output() menuAction = new EventEmitter<SubmenuTransfer>();

  // Control submenu visibility and active submenu index
  showSubmenu: boolean = false;
  activeSubmenuIndex: number | null = null;

  // Store rearranged submenus based on order bias
  rearrangedSubmenus: { buttonText: string; submenu: SubmenuTransfer }[] = [];

  ngOnInit() {
    this.rearrangeSubmenus();
  }

  rearrangeSubmenus() {
    const submenus = this.menuConfig.submenus;

    const submenusNotInBias: { buttonText: string; submenu: SubmenuTransfer }[] = [];
    const submenusInBias: { [type: string]: { buttonText: string; submenu: SubmenuTransfer }[] } = {};

    // Initialize submenusInBias for each type in orderBias
    for (const type of this.orderBias) {
      submenusInBias[type] = [];
    }

    // Separate submenus into biased and non-biased
    for (const submenuItem of submenus) {
      const type = submenuItem.submenu.type;
      if (this.orderBias.includes(type)) {
        submenusInBias[type].push(submenuItem);
      } else {
        submenusNotInBias.push(submenuItem);
      }
    }

    this.rearrangedSubmenus = [...submenusNotInBias];

    // Append submenus in bias at the end, in the order specified by orderBias
    for (const type of this.orderBias) {
      this.rearrangedSubmenus.push(...submenusInBias[type]);
    }
  }

  openSubmenu(index: number) {
    this.activeSubmenuIndex = index;
    this.showSubmenu = true;
  }

  handleSubmenuAction(submenuOutput: SubmenuOutput) {
    if (this.activeSubmenuIndex !== null) {
      const submenuItem = this.rearrangedSubmenus[this.activeSubmenuIndex];
      const submenuTransfer: SubmenuTransfer = {
        type: submenuItem.submenu.type,
        purpose: submenuItem.submenu.purpose,
        payload: submenuOutput,
      };
      this.menuAction.emit(submenuTransfer);
      this.closeSubmenu();
    }
  }

  closeSubmenu() {
    this.showSubmenu = false;
    this.activeSubmenuIndex = null;
  }

  // Helper methods to get payloads as the correct type, with fallbacks for optional values
  getTextInputSubmenuPayload(index: number): TextInputSubmenuInput {
    return this.rearrangedSubmenus[index].submenu.payload as TextInputSubmenuInput;
  }

  getConfirmationSubmenuPayload(index: number): ConfirmationSubmenuInput {
    return this.rearrangedSubmenus[index].submenu.payload as ConfirmationSubmenuInput;
  }

  getBackgroundSelectionSubmenuPayload(index: number): BackgroundSelectionSubmenuInput {
    return this.rearrangedSubmenus[index].submenu.payload as BackgroundSelectionSubmenuInput;
  }

  getColorSelectionSubmenuPayload(index: number): ColorSelectionSubmenuInput {
    return this.rearrangedSubmenus[index].submenu.payload as ColorSelectionSubmenuInput;
  }

  getDropdownSubmenuPayload(index: number): DropdownSubmenuInput {
    return this.rearrangedSubmenus[index].submenu.payload as DropdownSubmenuInput;
  }

  getGenerateBoardSubmenuPayload(index: number): GenerateBoardSubmenuInput {
    return this.rearrangedSubmenus[index].submenu.payload as GenerateBoardSubmenuInput;
  }
}
