import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../shared/components/menu/menu.component';
import { MenuConfig, SubmenuTransfer } from '../../../shared/models/menu.model';
import {
  SubmenuTypes,
  SubmenuOutput,
  TextInputSubmenuOutput,
  ConfirmationSubmenuOutput,
  ColorSelectionSubmenuOutput,
  GenerateBoardSubmenuOutput,
} from '../../../shared/models/submenuInputOutput.model';
import { BoardService } from '../../../core/services/board.service';
import { UpdateBoardRequest, CreateDuplicateBoardRequest } from '../../../shared/models/board.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-board-thumbnail',
  templateUrl: './board-thumbnail.component.html',
  styleUrls: ['./board-thumbnail.component.scss'],
  standalone: true,
  imports: [CommonModule, MenuComponent],
})
export class BoardThumbnailComponent {
  // Inputs from parent component
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() colorId: number | null = null;

  // Outputs to parent component (if needed)
  @Output() boardUpdated = new EventEmitter<void>();
  @Output() boardDeleted = new EventEmitter<void>();
  @Output() boardDuplicated = new EventEmitter<void>();

  // Control menu visibility
  showMenu: boolean = false;

  // Menu configuration
  menuConfig: MenuConfig | undefined;

  constructor(private boardService: BoardService) {
    this.initializeMenuConfig();
  }

  /**
   * Initializes the menu configuration with submenus.
   */
  initializeMenuConfig() {
    this.menuConfig = {
      title: 'Board Options',
      submenus: [
        {
          buttonText: 'Edit Background',
          submenu: {
            type: 'color-selection-submenu',
            purpose: 'editBackground',
            payload: {
              title: 'Edit Background',
              colorId: this.colorId,
              buttonText: 'Done',
            },
          },
        },
        {
          buttonText: 'Rename',
          submenu: {
            type: 'text-input-submenu',
            purpose: 'rename',
            payload: {
              title: 'Rename Board',
              textInputLabel: 'Name',
              initialText: this.name,
              buttonText: 'Rename',
            },
          },
        },
        {
          buttonText: 'Duplicate Board',
          submenu: {
            type: 'generate-board-submenu',
            purpose: 'duplicate',
            payload: {
              title: 'Duplicate Board',
              colorId: this.colorId,
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
            purpose: 'delete',
            payload: {
              title: 'Confirmation',
              confirmationMessage: `Are you sure you want to delete "${this.name}"?`,
              buttonText: 'Delete',
            },
          },
        },
      ],
    };
  }

  /**
   * Opens or closes the menu.
   */
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  /**
   * Handles actions emitted by the menu component.
   * @param submenuTransfer The submenu action data.
   */
  handleMenuAction(submenuTransfer: SubmenuTransfer) {
    switch (submenuTransfer.purpose) {
      case 'editBackground':
        this.handleEditBackground(submenuTransfer.payload as ColorSelectionSubmenuOutput);
        break;
      case 'rename':
        this.handleRename(submenuTransfer.payload as TextInputSubmenuOutput);
        break;
      case 'duplicate':
        this.handleDuplicate(submenuTransfer.payload as GenerateBoardSubmenuOutput);
        break;
      case 'delete':
        this.handleDelete(submenuTransfer.payload as ConfirmationSubmenuOutput);
        break;
      default:
        console.warn('Unknown submenu action:', submenuTransfer);
    }
  }

  /**
   * Handles background editing.
   * @param payload The color selection output.
   */
  handleEditBackground(payload: ColorSelectionSubmenuOutput) {
    const newColorId = payload.colorId;
    const updateRequest: UpdateBoardRequest = {
      id: this.id,
      name: this.name,
      colorId: newColorId,
    };
    this.boardService.updateBoard(updateRequest).subscribe({
      next: () => {
        this.colorId = newColorId; // Update local colorId
        this.initializeMenuConfig(); // Re-initialize menu config with updated colorId
        this.boardUpdated.emit();
      },
      error: (error) => {
        console.error('Failed to update board background:', error);
      },
    });
  }

  /**
   * Handles renaming the board.
   * @param payload The text input output.
   */
  handleRename(payload: TextInputSubmenuOutput) {
    const newName = payload.text.trim();
    if (newName) {
      const updateRequest: UpdateBoardRequest = {
        id: this.id,
        name: newName,
        colorId: this.colorId,
      };
      this.boardService.updateBoard(updateRequest).subscribe({
        next: () => {
          this.name = newName; // Update local name
          this.initializeMenuConfig(); // Re-initialize menu config with updated name
          this.boardUpdated.emit();
        },
        error: (error) => {
          console.error('Failed to rename board:', error);
        },
      });
    }
  }

  /**
   * Handles duplicating the board.
   * @param payload The generate board output.
   */
  handleDuplicate(payload: GenerateBoardSubmenuOutput) {
    const newBoardId = uuidv4(); // Generate a new unique ID
    const duplicateRequest: CreateDuplicateBoardRequest = {
      originalBoardId: this.id,
      newBoardId: newBoardId,
      newName: payload.name.trim(),
      colorId: payload.colorId,
    };
    this.boardService.duplicateBoard(duplicateRequest).subscribe({
      next: () => {
        this.boardDuplicated.emit();
      },
      error: (error) => {
        console.error('Failed to duplicate board:', error);
      },
    });
  }

  /**
   * Handles deleting the board.
   * @param payload The confirmation output.
   */
  handleDelete(payload: ConfirmationSubmenuOutput) {
    if (payload.confirmationStatus) {
      this.boardService.deleteBoard(this.id).subscribe({
        next: () => {
          this.boardDeleted.emit();
        },
        error: (error) => {
          console.error('Failed to delete board:', error);
        },
      });
    }
  }

  /**
   * Gets the gradient background style based on the color ID.
   * @returns The CSS background style.
   */
  getBackgroundStyle(): { [key: string]: string } {
    if (this.colorId) {
      return {
        'background-image': `var(--gradient-${this.colorId})`,
      };
    } else {
      return {
        'background-color': 'var(--neutral-darker)', // Fallback color
      };
    }
  }

  /**
   * Closes the menu when the menu's close event is emitted.
   */
  closeMenu() {
    this.showMenu = false;
  }
}
