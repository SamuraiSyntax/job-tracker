import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inline-edit-cell',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inline-edit-cell.component.html'
})
export class InlineEditCellComponent {
  // Inputs
  value = input.required<string | number | null | undefined>();
  type = input<'text' | 'number'>('text');
  placeholder = input<string>('-');
  isEditing = input<boolean>(false);

  // Outputs
  editCell = output<void>();
  save = output<string | number>();
  cancelEditEvent = output<void>();

  // État local
  editValue = signal<string | number>('');

  // Démarrer l'édition
  startEdit(): void {
    this.editValue.set(this.value() ?? '');
    this.editCell.emit();
  }

  // Sauvegarder
  saveValue(): void {
    const val = this.editValue();
    this.save.emit(this.type() === 'number' ? Number(val) : String(val));
  }

  // Annuler
  cancelEdit(): void {
    this.cancelEditEvent.emit();
  }

  // Mise à jour de la valeur
  updateValue(newValue: string | number): void {
    this.editValue.set(newValue);
  }
}
