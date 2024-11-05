import { MenuConfig } from "../models/menu.model";

export function generateListActionsMenuConfig(listName: string): MenuConfig {
  return {
    title: 'List actions',
    submenus: [
      {
        buttonText: 'Add a ticket',
        submenu: {
          type: 'text-input-submenu',
          purpose: 'addATicket',
          payload: {
            title: 'Add a ticket',
            textInputLabel: 'Name',
            placeholder: 'Enter ticket name...',
            buttonText: 'Add ticket',
          },
        },
      },
      {
        buttonText: 'Duplicate list',
        submenu: {
          type: 'text-input-submenu',
          purpose: 'duplicateList',
          payload: {
            title: 'Duplicate list',
            textInputLabel: 'Name',
            placeholder: 'Enter list name...',
            initialText: listName, // Pre-fills with the current list name
            buttonText: 'Duplicate',
          },
        },
      },
      {
        buttonText: 'Delete list',
        submenu: {
          type: 'confirmation-submenu',
          purpose: 'deleteList',
          payload: {
            title: 'Confirmation',
            confirmationMessage: `Are you sure you want to delete ${listName}?`, // Includes the list name in the confirmation
            buttonText: 'Delete',
          },
        },
      },
    ],
  };
}
