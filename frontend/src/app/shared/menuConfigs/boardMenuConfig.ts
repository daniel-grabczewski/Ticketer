import { MenuConfig } from '../models/menu.model';

export function generateBoardActionsMenuConfig(boardName: string, colorId: number | null): MenuConfig {
  return {
    title: 'Board actions',
    submenus: [
      {
        buttonText: 'Edit background',
        submenu: {
          type: 'background-selection-submenu',
          purpose: 'editBackground',
          payload: {
            title: 'Edit background',
            colorId: colorId, // Uses provided color ID, which may be null
            colorSelectionHeader: 'Select background',
            buttonText: 'Done',
          },
        },
      },
      {
        buttonText: 'Rename board',
        submenu: {
          type: 'text-input-submenu',
          purpose: 'renameBoard',
          payload: {
            title: 'Rename',
            textInputLabel: 'Name',
            initialText: boardName, // Sets initial text to current board name
            placeholder: 'Enter board name...',
            buttonText: 'Rename',
          },
        },
      },
      {
        buttonText: 'Duplicate',
        submenu: {
          type: 'generate-board-submenu',
          purpose: 'duplicateBoard',
          payload: {
            title: 'Duplicate',
            colorId: colorId, // Uses provided color ID, which may be null
            textInputLabel: 'Name',
            initialText: `Copy of ${boardName}`, // Prefills with copy of current board name
            placeholder: 'Enter board name...',
            colorSelectionHeader: 'Select background',
            buttonText: 'Duplicate',
          },
        },
      },
      {
        buttonText: 'Delete board',
        submenu: {
          type: 'confirmation-submenu',
          purpose: 'deleteBoard',
          payload: {
            title: 'Confirmation',
            confirmationMessage: `Are you sure you want to delete ${boardName}?`, // Confirmation message includes board name
            buttonText: 'Delete',
          },
        },
      },
    ],
  };
}
