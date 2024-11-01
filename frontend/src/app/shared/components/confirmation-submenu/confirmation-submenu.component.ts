import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ConfirmationSubmenuInput, ConfirmationSubmenuOutput } from '../../models/submenuInputOutput.model'

@Component({
  selector: 'app-confirmation-submenu',
  templateUrl: './confirmation-submenu.component.html',
  styleUrls: ['./confirmation-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ConfirmationSubmenuComponent implements ConfirmationSubmenuInput {
  // Inputs matching ConfirmationSubmenuInput
  @Input() title: string = ''
  @Input() confirmationMessage: string = ''
  @Input() buttonText: string = ''

  // Outputs for ConfirmationSubmenuOutput
  @Output() menuAction = new EventEmitter<ConfirmationSubmenuOutput>()
  @Output() close = new EventEmitter<void>()

  // Handle action button click
  onActionClicked() {
    // Emit the menu action with the specified structure
    this.menuAction.emit({
      confirmationStatus: true,
    })
    this.close.emit()
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit()
  }
}
