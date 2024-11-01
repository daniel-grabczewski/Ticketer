//These export interfaces are included as the Input when the menu passes data to the submenu

export type SubmenuTypes =
  | 'text-input-submenu'
  | 'confirmation-submenu'
  | 'background-selection-submenu'
  | 'generate-board-submenu'
  | 'color-selection-submenu'
  | 'dropdown-submenu';

// Text Input Submenu
export interface TextInputSubmenuInput {
  title: string;
  textInputLabel: string;
  initialText?: string;
  placeholder?: string;
  buttonText: string;
}
//initialText and placeHolder are optional because having a completely empty text input is allowed

export interface TextInputSubmenuOutput {
  text: string;
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
  colorId: number;
  colorSelectionHeader: string;
  buttonText: string;
}

export interface BackgroundSelectionSubmenuOutput {
  colorId: number;
}

// Generate Board Submenu
export interface GenerateBoardSubmenuInput {
  title: string;
  colorId: number;
  textInputLabel: string;
  initialText?: string;
  placeholder?: string;
  colorSelectionHeader: string;
  buttonText: string;
}
//initialText and placeHolder are optional because having a completely empty text input is allowed

export interface GenerateBoardSubmenuOutput {
  name: string;
  colorId: number;
}

// Color Selection Submenu
export interface ColorSelectionSubmenuInput {
  title: string;
  colorId: number;
  buttonText: string;
}

export interface ColorSelectionSubmenuOutput {
  colorId: number;
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
  | DropdownSubmenuInput;

// Union type for the Submenu Output
export type SubmenuOutput =
  | TextInputSubmenuOutput
  | ConfirmationSubmenuOutput
  | BackgroundSelectionSubmenuOutput
  | GenerateBoardSubmenuOutput
  | ColorSelectionSubmenuOutput
  | DropdownSubmenuOutput;
