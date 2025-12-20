import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidature, ColumnDefinition, SortDirection } from '@models/index';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableRowComponent } from './components/table-row/table-row.component';

@Component({
    selector: 'app-candidature-table',
    standalone: true,
    imports: [CommonModule, TableHeaderComponent, TableRowComponent],
    templateUrl: './candidature-table.component.html'
})
export class CandidatureTableComponent {
    // Inputs - données depuis le parent
    candidatures = input<Candidature[]>([]);
    visibleColumns = input<ColumnDefinition[]>([]);
    sortColumn = input<string | null>(null);
    sortDirection = input<SortDirection>(null);

    // Outputs - événements vers le parent
    sort = output<{ column: string; direction: SortDirection }>();
    edit = output<{ id: number; field: keyof Candidature; value: unknown }>();
    delete = output<number>();
    view = output<number>();
    archive = output<number>();

    // État local pour l'édition inline et les interactions
    editingCell = signal<{ candidatureId: number; field: string } | null>(null);
    activeDropdown = signal<{ candidatureId: number; field: string } | null>(null);
    hoveredScore = signal<{ candidatureId: number; score: number } | null>(null);

    // Gestion du tri (délégué au header)
    onSort(event: { column: string; direction: SortDirection }): void {
        this.sort.emit(event);
    }

    // Gestion de l'édition (déléguée aux rows)
    onStartEdit(candidatureId: number, field: string): void {
        this.editingCell.set({ candidatureId, field });
    }

    onSaveEdit(candidatureId: number, field: string, value: unknown): void {
        this.edit.emit({ id: candidatureId, field: field as keyof Candidature, value });
        this.editingCell.set(null);
        this.activeDropdown.set(null);
    }

    onCancelEdit(): void {
        this.editingCell.set(null);
        this.activeDropdown.set(null);
    }

    onToggleDropdown(candidatureId: number, field: string): void {
        const current = this.activeDropdown();
        if (current?.candidatureId === candidatureId && current?.field === field) {
            this.activeDropdown.set(null);
        } else {
            this.activeDropdown.set({ candidatureId, field });
            this.editingCell.set({ candidatureId, field });
        }
    }

    // Gestion du score avec hover (déléguée aux rows)
    onScoreHover(candidatureId: number, score: number): void {
        this.hoveredScore.set({ candidatureId, score });
    }

    onScoreLeave(): void {
        this.hoveredScore.set(null);
    }

    // Actions (déléguées aux rows)
    onDelete(id: number): void {
        this.delete.emit(id);
    }

    onView(id: number): void {
        this.view.emit(id);
    }

    onArchive(id: number): void {
        this.archive.emit(id);
    }

    // Tracking pour ngFor
    trackByFn(_: number, item: Candidature): number | undefined {
        return item.id;
    }

    // Calculer les clés des colonnes visibles pour les passer aux rows
    getVisibleColumnKeys(): string[] {
        return this.visibleColumns().map(col => col.key);
    }
}
