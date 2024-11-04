import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MenuComponent } from '../../../shared/components/menu/menu.component'
import { MenuConfig, SubmenuTransfer } from '../../../shared/models/menu.model'
import { SubmenuTypes, SubmenuOutput, TextInputSubmenuOutput, ConfirmationSubmenuOutput, ColorSelectionSubmenuOutput, GenerateBoardSubmenuOutput } from '../../../shared/models/submenuInputOutput.model'
import { BoardService } from '../../../core/services/board.service'
import { UpdateBoardRequest, CreateDuplicateBoardRequest, GetAllBoardsDetailsResponse } from '../../../shared/models/board.model'
import { v4 as uuidv4 } from 'uuid'

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
  @Output() boardDeleted = new EventEmitter<{ boardId: string }>()
  @Output() boardDuplicated = new EventEmitter<GetAllBoardsDetailsResponse>()

  showMenu: boolean = false
  menuConfig: MenuConfig = this.createMenuConfig()

  constructor(private boardService: BoardService) {}

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
        this.handleEditBackground(submenuTransfer.payload as ColorSelectionSubmenuOutput)
        break
      case 'rename':
        this.handleRename(submenuTransfer.payload as TextInputSubmenuOutput)
        break
      case 'duplicate':
        this.handleDuplicate(submenuTransfer.payload as GenerateBoardSubmenuOutput)
        break
      case 'delete':
        this.handleDelete(submenuTransfer.payload as ConfirmationSubmenuOutput)
        break
      default:
        console.warn('Unknown submenu action:', submenuTransfer)
    }
  }

  handleEditBackground(payload: ColorSelectionSubmenuOutput) {
    const newColorId = payload.colorId
    const updateRequest: UpdateBoardRequest = {
      id: this.id,
      name: this.name,
      colorId: newColorId,
    }
    this.boardService.updateBoard(updateRequest).subscribe({
      next: () => {
        this.colorId = newColorId
        this.menuConfig = this.createMenuConfig() // Update menu with new colorId
        this.boardUpdated.emit({ id: this.id, colorId: newColorId })
      },
      error: (error) => {
        console.error('Failed to update board background:', error)
      },
    })
  }

  handleRename(payload: TextInputSubmenuOutput) {
    const newName = payload.text.trim()
    if (newName) {
      const updateRequest: UpdateBoardRequest = {
        id: this.id,
        name: newName,
        colorId: this.colorId,
      }
      this.boardService.updateBoard(updateRequest).subscribe({
        next: () => {
          this.name = newName
          this.menuConfig = this.createMenuConfig() // Update menu with new name
          this.boardUpdated.emit({ id: this.id, name: newName })
        },
        error: (error) => {
          console.error('Failed to rename board:', error)
        },
      })
    }
  }

  handleDuplicate(payload: GenerateBoardSubmenuOutput) {
    const newBoardId = uuidv4()
    const duplicateRequest: CreateDuplicateBoardRequest = {
      originalBoardId: this.id,
      newBoardId: newBoardId,
      newName: payload.name.trim(),
      colorId: payload.colorId,
    }
    this.boardService.duplicateBoard(duplicateRequest).subscribe({
      next: () => {
        const newBoard: GetAllBoardsDetailsResponse = {
          id: newBoardId,
          name: payload.name.trim(),
          colorId: payload.colorId,
          listCount: 0,
          ticketCount: 0,
        }
        this.boardDuplicated.emit(newBoard)
      },
      error: (error) => {
        console.error('Failed to duplicate board:', error)
      },
    })
  }

  handleDelete(payload: ConfirmationSubmenuOutput) {
    if (payload.confirmationStatus) {
      this.boardService.deleteBoard(this.id).subscribe({
        next: () => {
          this.boardDeleted.emit({ boardId: this.id })
        },
        error: (error) => {
          console.error('Failed to delete board:', error)
        },
      })
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
