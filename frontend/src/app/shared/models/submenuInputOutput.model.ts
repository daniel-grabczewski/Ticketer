//These interfaces are included as the Input when the menu passes data to the submenu

type SubmenuTypes = 
  | 'text-input-submenu'
  | 'confirmation-submenu'
  | 'background-selection-submenu'
  | 'generate-board-submenu'
  | 'color-selection-submenu'
  | 'dropdown-submenu'

// Text Input Submenu
interface TextInputSubmenuInput {
  title: string;
  textInputLabel: string;
  initialText?: string; 
  placeholder? : string;
  buttonText: string;
}
//initialText and placeHolder are optional because having a completely empty text input is allowed

interface TextInputSubmenuOutput {
  text : string
}

// Confirmation Submenu
interface ConfirmationSubmenuInput {
  title: string;
  confirmationMessage: string;
  buttonText: string;
}

interface ConfirmationSubmenuOutput {
  confirmationStatus : boolean;
}

// Background Selection Submenu
interface BackgroundSelectionSubmenuInput {
  title: string;
  colorId: number;
  colorSelectionHeader: string;
  buttonText: string;
}

interface BackgroundSelectionSubmenuOutput {
  colorId : number
}

// Generate Board Submenu
interface GenerateBoardSubmenuInput {
  title: string;
  colorId: number;
  textInputLabel: string;
  initialText?: string;
  placeholder? : string;
  colorSelectionHeader: string;
  buttonText: string;
}
//initialText and placeHolder are optional because having a completely empty text input is allowed

interface GenerateBoardSubmenuOutput {
  name: string;
  colorId: number;
}

// Color Selection Submenu
interface ColorSelectionSubmenuInput {
  title: string;
  colorId: number;
  buttonText: string;
}

interface ColorSelectionSubmenuOutput {
  colorId : number
}

// Dropdown Submenu
interface DropdownSubmenuInput {
  title: string;
  dropdownInputLabel: string;
  dropdownItems: { id: string; name: string }[];
  dropdownPlaceholderText: string; //Initial text in dropdown, e.g. 'Pick one of the below...'
  buttonText: string;
}

interface DropdownSubmenuOutput {
  id: string;
  name: string;
}

// Union type for the Submenu Input
type SubmenuInput =
  | TextInputSubmenuInput
  | ConfirmationSubmenuInput
  | BackgroundSelectionSubmenuInput
  | GenerateBoardSubmenuInput
  | ColorSelectionSubmenuInput
  | DropdownSubmenuInput;

// Union type for the Submenu Output
  type SubmenuOutput =
  | TextInputSubmenuOutput
  | ConfirmationSubmenuOutput
  | BackgroundSelectionSubmenuOutput
  | GenerateBoardSubmenuOutput
  | ColorSelectionSubmenuOutput
  | DropdownSubmenuOutput;