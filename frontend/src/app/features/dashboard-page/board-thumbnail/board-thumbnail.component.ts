import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MenuComponent } from '../../../shared/components/menu/menu.component'
import { MenuConfig, SubmenuTransfer } from '../../../shared/models/menu.model'
import { SubmenuTypes, SubmenuOutput, TextInputSubmenuOutput, ConfirmationSubmenuOutput, ColorSelectionSubmenuOutput, GenerateBoardSubmenuOutput } from '../../../shared/models/submenuInputOutput.model'
import { GetAllBoardsDetailsResponse } from '../../../shared/models/board.model'

@Component({
  selector: 'app-board-thumbnail',
  templateUrl: './board-thumbnail.component.html',
  styleUrls: ['./board-thumbnail.component.scss'],
  standalone: true,
  imports: [CommonModule, MenuComponent],
})
export class BoardThumbnailComponent implements OnChanges {
  @Input() id: string = ''
  @Input() name: string = ''
  @Input() colorId: number | null = null

  @Output() boardUpdated = new EventEmitter<Partial<GetAllBoardsDetailsResponse>>()
  @Output() boardDeleted = new EventEmitter<string>()
  @Output() boardDuplicated = new EventEmitter<{ newName: string; colorId: number | null; originalBoardId: string }>()

  showMenu: boolean = false
  menuConfig: MenuConfig = this.createMenuConfig()

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['name'] || changes['colorId']) {
      this.menuConfig = this.createMenuConfig()
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu
  }

  handleMenuAction(submenuTransfer: SubmenuTransfer) {
    switch (submenuTransfer.purpose) {
      case 'editBackground':
        this.boardUpdated.emit({ id: this.id, name: this.name, colorId: (submenuTransfer.payload as ColorSelectionSubmenuOutput).colorId })
        break
      case 'rename':
        this.boardUpdated.emit({ id: this.id, name: (submenuTransfer.payload as TextInputSubmenuOutput).text, colorId: this.colorId })
        break
      case 'duplicate':
        const duplicatePayload = submenuTransfer.payload as GenerateBoardSubmenuOutput
        console.log("Emitting board duplicate with:", { newName: duplicatePayload.name.trim(), colorId: duplicatePayload.colorId, originalBoardId: this.id })
        this.boardDuplicated.emit({ newName: duplicatePayload.name.trim(), colorId: duplicatePayload.colorId, originalBoardId: this.id })
        break
      case 'delete':
        if ((submenuTransfer.payload as ConfirmationSubmenuOutput).confirmationStatus) {
          this.boardDeleted.emit(this.id)
        }
        break
      default:
        console.warn('Unknown submenu action:', submenuTransfer)
    }
  }

  getBackgroundStyle(): { [key: string]: string } {
    return this.colorId
      ? { 'background-image': `var(--gradient-${this.colorId})` }
      : { 'background-color': 'var(--neutral-darker)' }
  }

  closeMenu() {
    this.showMenu = false
  }

  private createMenuConfig(): MenuConfig {
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
              colorSelectionHeader : 'Select background',
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
    }
  }
}
