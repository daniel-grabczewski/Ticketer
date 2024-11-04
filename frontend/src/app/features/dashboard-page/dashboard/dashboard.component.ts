import { Component, OnInit } from '@angular/core'
import { v4 as uuidv4 } from 'uuid'
import { CommonModule } from '@angular/common'
import { BoardService } from '../../../core/services/board.service'
import { CreateBoardRequest, GetAllBoardsDetailsResponse, UpdateBoardRequest } from '../../../shared/models/board.model'
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
  submenuTitle = 'Generate Board'
  textInputLabel = 'Name'
  colorSelectionHeader = 'Background'
  buttonText = 'Create'
  defaultColorId: number | null = null

  showSubmenu: boolean = false
  boards: GetAllBoardsDetailsResponse[] = []

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    this.fetchAllBoards()
  }

  fetchAllBoards() {
    this.boardService.getAllBoards().subscribe({
      next: (data) => {
        this.boards = data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      },
      error: (error) => {
        console.error('Error fetching boards:', error)
      },
    })
  }
  

  openSubmenu() {
    this.showSubmenu = true
  }

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
        this.boards.push({ id: newBoardId, name, colorId, listCount: 0, ticketCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      },
      error: (error) => {
        console.error('Error creating board:', error)
      },
    })

    this.showSubmenu = false
  }

  onBoardUpdated(boardId: string, updatedData: Partial<GetAllBoardsDetailsResponse>) {
    const existingBoard = this.boards.find(board => board.id === boardId)
    if (!existingBoard) return

    const updateRequest: UpdateBoardRequest = {
      id: boardId,
      name: updatedData.name ?? existingBoard.name, // Ensure name is updated or remains current
      colorId: updatedData.colorId ?? existingBoard.colorId, // Ensure colorId is updated or remains current
    }
  
    this.boardService.updateBoard(updateRequest).subscribe({
      next: () => {
        this.boards = this.boards.map(board => 
          board.id === boardId ? { ...board, ...updatedData, updatedAt: new Date().toISOString() } : board
        )
      },
      error: (error) => {
        console.error('Failed to update board:', error)
      },
    })
  }
  

  onBoardDeleted(boardId: string) {
    this.boardService.deleteBoard(boardId).subscribe({
      next: () => {
        this.boards = this.boards.filter(board => board.id !== boardId)
      },
      error: (error) => {
        console.error('Failed to delete board:', error)
      },
    })
  }

  onBoardDuplicated(newBoardData: { newName: string; colorId: number | null; originalBoardId: string }) {
    const newBoardId = uuidv4()

    const duplicateRequest = {
      originalBoardId: newBoardData.originalBoardId,
      newBoardId,
      newName: newBoardData.newName,
      colorId: newBoardData.colorId,
    }

    console.log("Sending duplicate request with:", duplicateRequest)

    this.boardService.duplicateBoard(duplicateRequest).subscribe({
      next: () => {
        console.log("Duplicate request succeeded. Adding new board to list.")
        this.boards.push({
          id: newBoardId,
          name: newBoardData.newName,
          colorId: newBoardData.colorId,
          listCount: 0,
          ticketCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      },
      error: (error) => {
        console.error('Failed to duplicate board:', error)
      },
    })
  }
}
