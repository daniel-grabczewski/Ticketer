import { Component, OnInit } from '@angular/core';
import { GetColorsResponse } from '../../models/color.model';
import { ColorService } from '../../../core/services/color.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-background-selection-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background-selection-panel.component.html',
  styleUrls: ['./background-selection-panel.component.scss']
})
export class BackgroundSelectionPanelComponent implements OnInit {
  colors: GetColorsResponse[] = [] // Variable to store the colors

  constructor(private colorService: ColorService) {}

  ngOnInit() {
    this.colorService.getAllColors().subscribe({
      next: (data) => {
        this.colors = data; // Store the colors received from the service
        console.log(this.colors)
      },
      error: (error) => {
        console.error('Failed to fetch colors:', error); // Handle any errors here
      },
      complete: () => {
        console.log('Color fetch completed'); // Optional complete callback
      }
    });
  }


  
}
