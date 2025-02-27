import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-guest-data-dialog',
    imports: [MatDialogModule, MatButtonModule],
    styleUrls: ['./guest-data-dialog.component.scss'],
    template: `
    <h1 mat-dialog-title>Transfer Guest Data</h1>
    <div mat-dialog-content style="padding-bottom: 2px !important;">
      <p style="font-size : 16px !important;">Do you want to transfer your guest data to your new account?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button color="primary" (click)="onYesClick()">Yes</button>
      <button mat-button (click)="onNoClick()">No</button>
    </div>
  `
})
export class GuestDataDialogComponent {
  constructor(public dialogRef: MatDialogRef<GuestDataDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
