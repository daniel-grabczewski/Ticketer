import { Component, OnInit } from '@angular/core'
import { v4 as uuidv4 } from 'uuid'
import { CommonModule } from '@angular/common'
import { BoardService } from '../../../core/services/board.service'
import { CreateBoardRequest, GetAllBoardsDetailsResponse } from '../../../shared/models/board.model'
import { GenerateBoardSubmenuComponent } from '../../../shared/components/generate-board-submenu/generate-board-submenu.component'
import { BoardThumbnailComponent } from '../board-thumbnail/board-thumbnail.component'
import { GenerateBoardSubmenuOutput } from '../../../shared/models/submenuInputOutput.model'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, GenerateBoardSubmenuComponent, BoardThumbnailComponent],
})
export class DashboardComponent implements OnInit {
  // Variables for the submenu component
  submenuTitle = 'Generate Board'
  textInputLabel = 'Name'
  colorSelectionHeader = 'Background'
  buttonText = 'Create'
  defaultColorId: number | null = null

  // Control submenu visibility
  showSubmenu: boolean = false

  // Array to hold board details for display
  boards: GetAllBoardsDetailsResponse[] = []

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    // Fetch all boards on initialization
    this.fetchAllBoards()
  }

  /**
   * Fetches all boards from the server and updates the boards array.
   */
  fetchAllBoards() {
    this.boardService.getAllBoards().subscribe({
      next: (data) => {
        this.boards = data
      },
      error: (error) => {
        console.error('Error fetching boards:', error)
      },
    })
  }

  /**
   * Opens the submenu for creating a new board.
   */
  openSubmenu() {
    this.showSubmenu = true
  }

  /**
   * Handles the creation of a new board based on submenu action.
   * @param event The submenu output with name and colorId
   */
  handleMenuAction(event: GenerateBoardSubmenuOutput) {
    const { name, colorId } = event
    const newBoardId = uuidv4()

    const request: CreateBoardRequest = {
      id: newBoardId,
      name,
      colorId,
    }

    this.boardService.createBoard(request).subscribe({
      next: () => {
        // Optimistically add the new board to the list
        this.boards.push({ id: newBoardId, name, colorId, listCount: 0, ticketCount: 0 })
      },
      error: (error) => {
        console.error('Error creating board:', error)
      },
    })

    this.showSubmenu = false
  }

  /**
   * Handles board updates from BoardThumbnailComponent.
   */
  onBoardUpdated(boardId: string, updatedData: Partial<GetAllBoardsDetailsResponse>) {
    this.boards = this.boards.map(board =>
      board.id === boardId ? { ...board, ...updatedData } : board
    )
  }

  /**
   * Handles board deletion from BoardThumbnailComponent.
   */
  onBoardDeleted(boardId: string) {
    this.boards = this.boards.filter(board => board.id !== boardId)
  }

  /**
   * Handles board duplication from BoardThumbnailComponent.
   */
  onBoardDuplicated(newBoard: GetAllBoardsDetailsResponse) {
    this.boards.push(newBoard)
  }
}
