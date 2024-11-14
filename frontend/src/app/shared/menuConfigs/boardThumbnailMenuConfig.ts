import { MenuConfig } from '../models/menu.model';

export function generateBoardMenuConfig(
  boardName: string,
  colorId: number | null
): MenuConfig {
  return {
    title: 'Board Options',
    submenus: [
      {
        buttonText: 'Edit Background',
        submenu: {
          type: 'background-selection-submenu',
          purpose: 'editBackground',
          payload: {
            title: 'Edit Background',
            colorSelectionHeader: 'Select background',
            colorId: colorId,
            buttonText: 'Done',
          },
        },
      },
      {
        buttonText: 'Rename Board',
        submenu: {
          type: 'text-input-submenu',
          purpose: 'renameBoard',
          payload: {
            title: 'Rename Board',
            textInputLabel: 'Name',
            initialText: boardName,
            buttonText: 'Rename',
          },
        },
      },
      {
        buttonText: 'Duplicate Board',
        submenu: {
          type: 'generate-board-submenu',
          purpose: 'duplicateBoard',
          payload: {
            title: 'Duplicate Board',
            colorId: colorId,
            textInputLabel: 'Name',
            placeholder: 'Enter board name...',
            colorSelectionHeader: 'Select Background',
            buttonText: 'Duplicate',
          },
        },
      },
      {
        buttonText: 'Delete Board',
        submenu: {
          type: 'confirmation-submenu',
          purpose: 'deleteBoard',
          payload: {
            title: 'Confirmation',
            confirmationMessage: `Are you sure you want to delete "${boardName}"?`,
            buttonText: 'Delete',
          },
        },
      },
    ],
  };
}
