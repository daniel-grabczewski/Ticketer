import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DragStateService {
  // BehaviorSubject to hold the dragging state, initialized to false
  private isDraggingSubject = new BehaviorSubject<boolean>(false);

  // Observable for components to subscribe to if needed
  public isDragging$ = this.isDraggingSubject.asObservable();

  // Method to set the dragging state
  setIsDragging(isDragging: boolean): void {
    this.isDraggingSubject.next(isDragging);
  }

  // Method to get the current dragging state synchronously
  getIsDragging(): boolean {
    return this.isDraggingSubject.value;
  }
}
