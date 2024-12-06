import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  MenuConfig,
  SubmenuOutputTransfer,
} from '../../../../shared/models/menu.model';
import {
  GenerateBoardSubmenuOutput,
  ColorSelectionSubmenuOutput,
  ConfirmationSubmenuOutput,
  TextInputSubmenuOutput,
} from '../../../../shared/models/submenuInputOutput.model';
import { GetAllBoardsDetailsResponse } from '../../../../shared/models/board.model';
import { generateBoardMenuConfig } from '../../../../shared/menuConfigs/boardThumbnailMenuConfig';
import { OverlayService } from '../../../../core/services/overlay.service';

@Component({
    selector: 'app-board-thumbnail',
    templateUrl: './board-thumbnail.component.html',
    styleUrls: ['./board-thumbnail.component.scss'],
    imports: [CommonModule]
})
export class BoardThumbnailComponent implements OnChanges {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() colorId: number | null = null;
  @Input() showMenu: boolean = false;

  @Output() boardUpdated = new EventEmitter<
    Partial<GetAllBoardsDetailsResponse>
  >();
  @Output() boardDeleted = new EventEmitter<string>();
  @Output() boardDuplicated = new EventEmitter<{
    newName: string;
    colorId: number | null;
    originalBoardId: string;
  }>();
  @Output() toggleMenu = new EventEmitter<void>();

  menuConfig!: MenuConfig;

  constructor(private router: Router, private overlayService: OverlayService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['name'] || changes['colorId']) {
      this.menuConfig = generateBoardMenuConfig(this.name, this.colorId);
    }
  }

  // Navigate to the board page when the thumbnail is clicked
  navigateToBoard() {
    const slug = this.name.replace(/\s+/g, '-').toLowerCase();
    this.router.navigate([`/board`, this.id, slug]);
  }

  handleMenuAction(output: SubmenuOutputTransfer) {
    console.log('Handling submenu action in BoardThumbnailComponent:', output);
    const { purpose, payload } = output;
    switch (purpose) {
      case 'editBackground':
        this.boardUpdated.emit({
          colorId: (payload as ColorSelectionSubmenuOutput).colorId,
        });
        break;
      case 'renameBoard':
        this.boardUpdated.emit({
          name: (payload as TextInputSubmenuOutput).text,
        });
        break;
      case 'duplicateBoard':
        const duplicatePayload = payload as GenerateBoardSubmenuOutput;
        this.boardDuplicated.emit({
          newName: duplicatePayload.name.trim(),
          colorId: duplicatePayload.colorId,
          originalBoardId: this.id,
        });
        break;
      case 'deleteBoard':
        if ((payload as ConfirmationSubmenuOutput).confirmationStatus) {
          this.boardDeleted.emit(this.id);
        }
        break;
      default:
        console.warn('Unknown submenu action:', output);
    }
  }

  getBackgroundStyle(): { [key: string]: string } {
    return this.colorId
      ? { 'background-image': `var(--gradient-${this.colorId})` }
      : { 'background-color': 'var(--neutral-darker)' };
  }

  openMenuOverlay(event: Event) {
    const target = event.target as HTMLElement;
    if (this.menuConfig) {
      this.overlayService.openOverlay(target, this.menuConfig, (output) => {
        console.log(
          'Menu action received in BoardThumbnailComponent callback:',
          output
        );
        this.handleMenuAction(output);
      });
    }
  }

  closeMenu() {
    console.log('Closing menu from board-thumbnail component.');
    this.toggleMenu.emit();
  }
}
