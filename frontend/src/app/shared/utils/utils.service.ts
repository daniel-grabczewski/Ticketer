import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  // Helper function for formatting date and time into DD/MM/YYYY HH:MM AM/PM
  formatDateTime(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 should be 12)

    const formattedHours = String(hours).padStart(2, '0');

    return `${day}/${month}/${year} ${formattedHours}:${minutes}${ampm}`;
  }

  //Given a string, remove leading and trailing whitespace, and limit whitespace between characters to 1 character max.
  // e.g. given " Hello     there ", return "Hello there"
  cleanStringWhiteSpace(string: string): string {
    return string.trim().replace(/\s+/g, ' ');
  }
}
