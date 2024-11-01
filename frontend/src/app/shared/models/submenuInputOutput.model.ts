//These export interfaces are included as the Input when the menu passes data to the submenu

export type SubmenuTypes =
  | 'text-input-submenu'
  | 'confirmation-submenu'
  | 'background-selection-submenu'
  | 'generate-board-submenu'
  | 'color-selection-submenu'
  | 'dropdown-submenu'
  | 'create-board-item-submenu'
  ;

// Text Input Submenu
export interface TextInputSubmenuInput {
  title: string;
  textInputLabel: string;
  initialText?: string;
  placeholder?: string;
  buttonText: string;
}
//initialText and placeholder are optional because having a completely empty text input is allowed

export interface TextInputSubmenuOutput {
  text: string;
}

// Create Board Item Submenu
export interface CreateBoardItemSubmenuInput {
  title : string
  placeholderText? : string
  buttonText : string
}
// placeholder is optional because having a completely empty text input is allowed

export interface CreateBoardItemSubmenuOutput {
  text : string;
}

// Confirmation Submenu
export interface ConfirmationSubmenuInput {
  title: string;
  confirmationMessage: string;
  buttonText: string;
}

export interface ConfirmationSubmenuOutput {
  confirmationStatus: boolean;
}

// Background Selection Submenu
export interface BackgroundSelectionSubmenuInput {
  title: string;
  colorId: number | null;
  colorSelectionHeader: string;
  buttonText: string;
}

export interface BackgroundSelectionSubmenuOutput {
  colorId: number | null;
}

// Generate Board Submenu
export interface GenerateBoardSubmenuInput {
  title: string;
  colorId: number | null;
  textInputLabel: string;
  initialText?: string;
  placeholder?: string;
  colorSelectionHeader: string;
  buttonText: string;
}
//initialText and placeholder are optional because having a completely empty text input is allowed

export interface GenerateBoardSubmenuOutput {
  name: string;
  colorId: number | null;
}

// Color Selection Submenu
export interface ColorSelectionSubmenuInput {
  title: string;
  colorId: number | null;
  buttonText: string;
}

export interface ColorSelectionSubmenuOutput {
  colorId: number | null;
}

// Dropdown Submenu
export interface DropdownSubmenuInput {
  title: string;
  dropdownInputLabel: string;
  dropdownItems: { id: string; name: string }[];
  dropdownPlaceholderText: string; //Initial text in dropdown, e.g. 'Pick one of the below...'
  buttonText: string;
}

export interface DropdownSubmenuOutput {
  id: string;
  name: string;
}

// Union type for the Submenu Input
export type SubmenuInput =
  | TextInputSubmenuInput
  | ConfirmationSubmenuInput
  | BackgroundSelectionSubmenuInput
  | GenerateBoardSubmenuInput
  | ColorSelectionSubmenuInput
  | DropdownSubmenuInput
  | CreateBoardItemSubmenuInput;

// Union type for the Submenu Output
export type SubmenuOutput =
  | TextInputSubmenuOutput
  | ConfirmationSubmenuOutput
  | BackgroundSelectionSubmenuOutput
  | GenerateBoardSubmenuOutput
  | ColorSelectionSubmenuOutput
  | DropdownSubmenuOutput
  | CreateBoardItemSubmenuOutput;
