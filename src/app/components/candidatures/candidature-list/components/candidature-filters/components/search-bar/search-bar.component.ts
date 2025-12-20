import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
  // Input - valeur depuis le parent
  searchTerm = input<string>('');

  // Output - changement vers le parent
  searchTermChange = output<string>();

  // Émettre le changement
  onSearchChange(value: string): void {
    this.searchTermChange.emit(value);
  }

  // Effacer la recherche
  clearSearch(): void {
    this.searchTermChange.emit('');
  }
}
