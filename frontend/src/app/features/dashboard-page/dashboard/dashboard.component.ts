import { Component } from '@angular/core'
import { v4 as uuidv4 } from 'uuid'
import { CreateBoardRequest } from '../../../shared/models/board.model'
import { CommonModule } from '@angular/common'
import { GenerateBoardSubmenuComponent } from '../../../shared/components/generate-board-submenu/generate-board-submenu.component'
import { BoardService } from '../../../core/services/board.service'
import { GenerateBoardSubmenuOutput } from '../../../shared/models/submenuInputOutput.model'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, GenerateBoardSubmenuComponent],
})
export class DashboardComponent {
  // Variables for the submenu
  submenuTitle = 'Generate Board'
  textInputLabel = 'Name'
  colorSelectionHeader = 'Background'
  buttonText = 'Create'
  defaultColorId: number | null = null

  // Control submenu visibility
  showSubmenu: boolean = false

  constructor(private boardService: BoardService) {}

  // Method to handle button click to open submenu
  openSubmenu() {
    this.showSubmenu = true
  }

  // Method to handle the menu action emitted by the submenu
  handleMenuAction(event: GenerateBoardSubmenuOutput) {
    const { name, colorId } = event
    // Generate a random ID for the new board
    const newBoardId = uuidv4()

    // Create the request object
    const request: CreateBoardRequest = {
      id: newBoardId,
      name: name,
      colorId: colorId,
    }

    // Call the service to create the board
    this.boardService.createBoard(request).subscribe({
      next: () => {
        console.log('Board created successfully')
        // Optionally, refresh the list of boards or perform other actions
      },
      error: (error) => {
        console.error('Error creating board:', error)
        // Handle error (e.g., display a message to the user)
      },
    })

    // Close the submenu after the action is handled
    this.showSubmenu = false
  }
}
