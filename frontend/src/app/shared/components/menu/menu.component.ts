import { Component, Input, Output, EventEmitter, ElementRef, OnDestroy, OnInit, AfterViewInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MenuConfig, SubmenuTransfer } from '../../models/menu.model'
import { SubmenuTypes } from '../../models/submenuInputOutput.model'
import { SubmenuInput, SubmenuOutput, TextInputSubmenuInput, ConfirmationSubmenuInput, BackgroundSelectionSubmenuInput, GenerateBoardSubmenuInput, ColorSelectionSubmenuInput, DropdownSubmenuInput } from '../../models/submenuInputOutput.model'
import { TextInputSubmenuComponent } from '../text-input-submenu/text-input-submenu.component'
import { ConfirmationSubmenuComponent } from '../confirmation-submenu/confirmation-submenu.component'
import { BackgroundSelectionSubmenuComponent } from '../background-selection-submenu/background-selection-submenu.component'
import { GenerateBoardSubmenuComponent } from '../generate-board-submenu/generate-board-submenu.component'
import { ColorSelectionSubmenuComponent } from '../color-selection-submenu/color-selection-submenu.component'
import { DropdownSubmenuComponent } from '../dropdown-submenu/dropdown-submenu.component'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TextInputSubmenuComponent,
    ConfirmationSubmenuComponent,
    BackgroundSelectionSubmenuComponent,
    GenerateBoardSubmenuComponent,
    ColorSelectionSubmenuComponent,
    DropdownSubmenuComponent,
  ],
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() menuConfig: MenuConfig = { title: '', submenus: [] }
  @Input() orderBias: SubmenuTypes[] = ['confirmation-submenu']
  @Output() menuAction = new EventEmitter<SubmenuTransfer>()
  @Output() close = new EventEmitter<void>()

  showSubmenu: boolean = false
  activeSubmenuIndex: number | null = null
  rearrangedSubmenus: { buttonText: string; submenu: SubmenuTransfer }[] = []

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.rearrangeSubmenus()
    console.log("Initialized menu component:", this.menuConfig)
  }

  ngAfterViewInit() {
    this.enableOutsideClickDetection()
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onClickOutside.bind(this))
    console.log("Removed outside click listener")
  }

  rearrangeSubmenus() {
    const submenus = this.menuConfig.submenus
    const submenusNotInBias: { buttonText: string; submenu: SubmenuTransfer }[] = []
    const submenusInBias: { [type: string]: { buttonText: string; submenu: SubmenuTransfer }[] } = {}

    for (const type of this.orderBias) {
      submenusInBias[type] = []
    }

    for (const submenuItem of submenus) {
      const type = submenuItem.submenu.type
      if (this.orderBias.includes(type)) {
        submenusInBias[type].push(submenuItem)
      } else {
        submenusNotInBias.push(submenuItem)
      }
    }

    this.rearrangedSubmenus = [...submenusNotInBias]
    for (const type of this.orderBias) {
      this.rearrangedSubmenus.push(...submenusInBias[type])
    }
    console.log("Rearranged submenus:", this.rearrangedSubmenus)
  }

  openSubmenu(index: number) {
    this.activeSubmenuIndex = index
    this.showSubmenu = true
    console.log("Opening submenu at index:", index)
  }

  handleSubmenuAction(submenuOutput: SubmenuOutput) {
    if (this.activeSubmenuIndex !== null) {
      const submenuItem = this.rearrangedSubmenus[this.activeSubmenuIndex]
      const submenuTransfer: SubmenuTransfer = {
        type: submenuItem.submenu.type,
        purpose: submenuItem.submenu.purpose,
        payload: submenuOutput,
      }
      this.menuAction.emit(submenuTransfer)
      console.log("Submenu action emitted:", submenuTransfer)
      this.closeSubmenu()
    }
  }

  closeSubmenu() {
    this.showSubmenu = false
    this.activeSubmenuIndex = null
    console.log("Closed submenu")
  }

  closeMenu() {
    this.close.emit()
    console.log("Closed menu")
  }

  enableOutsideClickDetection() {
    // Attach the outside click listener with a short delay to prevent immediate closure
    setTimeout(() => {
      document.addEventListener('click', this.onClickOutside.bind(this))
      console.log("Enabled outside click detection")
    }, 50)
  }

  private onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement
    const clickedInsideMenu = this.elementRef.nativeElement.contains(target)

    console.log("Outside click detected. Clicked inside menu:", clickedInsideMenu)

    if (!clickedInsideMenu) {
      if (this.showSubmenu) {
        this.closeSubmenu()
        console.log("Clicked outside submenu, closing submenu")
      } else {
        this.closeMenu()
        console.log("Clicked outside menu, closing menu")
      }
    }
  }

  getTextInputSubmenuPayload(index: number): TextInputSubmenuInput {
    return this.rearrangedSubmenus[index].submenu.payload as TextInputSubmenuInput
  }

  getConfirmationSubmenuPayload(index: number): ConfirmationSubmenuInput {
    return this.rearrangedSubmenus[index].submenu.payload as ConfirmationSubmenuInput
  }

  getBackgroundSelectionSubmenuPayload(index: number): BackgroundSelectionSubmenuInput {
    return this.rearrangedSubmenus[index].submenu.payload as BackgroundSelectionSubmenuInput
  }

  getColorSelectionSubmenuPayload(index: number): ColorSelectionSubmenuInput {
    return this.rearrangedSubmenus[index].submenu.payload as ColorSelectionSubmenuInput
  }

  getDropdownSubmenuPayload(index: number): DropdownSubmenuInput {
    return this.rearrangedSubmenus[index].submenu.payload as DropdownSubmenuInput
  }

  getGenerateBoardSubmenuPayload(index: number): GenerateBoardSubmenuInput {
    return this.rearrangedSubmenus[index].submenu.payload as GenerateBoardSubmenuInput
  }
}
