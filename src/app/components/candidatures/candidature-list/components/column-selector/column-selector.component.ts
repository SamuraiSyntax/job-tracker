import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDefinition } from '@models/index';

@Component({
  selector: 'app-column-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column-selector.component.html'
})
export class ColumnSelectorComponent {
  // Inputs - données du parent
  visibleColumns = input<Set<string>>(new Set());
  availableColumns = input<ColumnDefinition[]>([]);

  // Outputs - événements vers le parent
  toggleColumn = output<string>();
  showAllColumns = output<void>();
  hideAllColumns = output<void>();

  // État local pour le dropdown
  showColumnSelector = signal(false);
  searchColumnTerm = signal('');

  // Basculer l'affichage du sélecteur
  toggleColumnSelector(): void {
    this.showColumnSelector.update(v => !v);
  }

  // Fermer le dropdown
  closeColumnSelector(): void {
    this.showColumnSelector.set(false);
  }

  // Vérifier si une colonne est visible
  isColumnVisible(columnKey: string): boolean {
    return this.visibleColumns().has(columnKey);
  }

  // Compter les colonnes visibles
  getVisibleColumnCount(): number {
    return this.visibleColumns().size;
  }

  // Émettre l'événement de basculement d'une colonne
  onToggleColumn(columnKey: string): void {
    this.toggleColumn.emit(columnKey);
  }

  // Émettre l'événement pour afficher toutes les colonnes
  onShowAllColumns(): void {
    this.showAllColumns.emit();
  }

  // Émettre l'événement pour masquer toutes les colonnes
  onHideAllColumns(): void {
    this.hideAllColumns.emit();
  }

  // Mettre à jour le terme de recherche
  updateSearchTerm(value: string): void {
    this.searchColumnTerm.set(value);
  }

    // Drag & drop state
  draggedIndex: number | null = null;
  dragOverIndex: number | null = null;

  // Output pour l'ordre des colonnes
  columnsReordered = output<ColumnDefinition[]>();

  // Ordre local des colonnes (pour drag & drop)
  private localColumns: ColumnDefinition[] = [];

  ngOnInit(): void {
    this.localColumns = [...this.availableColumns()];
  }

  ngOnChanges(): void {
    this.localColumns = [...this.availableColumns()];
  }

  getFilteredColumns(): ColumnDefinition[] {
    const term = this.searchColumnTerm().toLowerCase();
    const cols = this.localColumns;
    if (!term) return cols;
    return cols.filter(col => col.label.toLowerCase().includes(term));
  }

  onDragStart(index: number, event: DragEvent): void {
    this.draggedIndex = index;
    event.dataTransfer?.setData('text/plain', index.toString());
    event.dataTransfer!.effectAllowed = 'move';
  }

  onDragOver(index: number, event: DragEvent): void {
    event.preventDefault();
    this.dragOverIndex = index;
  }

  onDrop(index: number, event: DragEvent): void {
    event.preventDefault();
    if (this.draggedIndex === null || this.draggedIndex === index) return;
    const cols = [...this.localColumns];
    const [removed] = cols.splice(this.draggedIndex, 1);
    cols.splice(index, 0, removed);
    this.localColumns = cols;
    this.draggedIndex = null;
    this.dragOverIndex = null;
    this.columnsReordered.emit(cols);
  }

  onDragEnd(): void {
    this.draggedIndex = null;
    this.dragOverIndex = null;
  }
}
