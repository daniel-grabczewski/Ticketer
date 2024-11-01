import {
  SubmenuTypes,
  SubmenuInput,
  SubmenuOutput,
} from './submenuInputOutput.model';
// Parent = (MenuConfig) => Menu = (SubmenuTransfer) => Submenu = (SubmenuTransfer) => Menu = (SubmenuTransfer) => Parent

// Used when parent of menu sends it desired menus
export interface MenuConfig {
  submenus: SubmenuTransfer[];
}

export interface SubmenuTransfer {
  type: SubmenuTypes; // e.g., 'text-input-submenu', 'confirmation-submenu'
  purpose: string; // e.g., 'rename', 'duplicate' (used to differentiate the purposes multiple same type submenus in the same menu)
  payload: SubmenuInput | SubmenuOutput;
}
