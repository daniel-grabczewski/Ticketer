import {
  SubmenuTypes,
  SubmenuInput,
  SubmenuOutput,
} from './submenuInputOutput.model';
// Parent = (MenuConfig) => Menu = (SubmenuTransfer) => Submenu = (SubmenuTransfer) => Menu = (SubmenuTransfer) => Parent

// Used when parent of menu sends it desired menus
export interface MenuConfig {
  title : string
  submenus: {
    buttonText : string
    submenu : SubmenuTransfer
  } []
}

export interface SubmenuTransfer {
  type: SubmenuTypes; // e.g., 'text-input-submenu', 'confirmation-submenu'
  purpose: string; // e.g., 'rename', 'duplicate' (used to differentiate the purposes multiple same type submenus in the same menu)
  payload: SubmenuInput | SubmenuOutput;
}


export interface SubmenuInputTransfer {
  type: SubmenuTypes; // e.g., 'text-input-submenu', 'confirmation-submenu'
  purpose: string; // e.g., 'rename', 'duplicate' (used to differentiate the purposes multiple same type submenus in the same menu)
  payload: SubmenuInput ;
}

export interface SubmenuOutputTransfer {
  type: SubmenuTypes; // e.g., 'text-input-submenu', 'confirmation-submenu'
  purpose: string; // e.g., 'rename', 'duplicate' (used to differentiate the purposes multiple same type submenus in the same menu)
  payload: SubmenuOutput ;
}