import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDefinition, SortDirection } from '@models/index';

@Component({
    selector: '[appTableHeader]',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './table-header.component.html'
})
export class TableHeaderComponent {
    // Inputs
    columns = input.required<ColumnDefinition[]>();
    sortColumn = input<string | null>(null);
    sortDirection = input<SortDirection>(null);

    // Outputs
    sort = output<{ column: string; direction: SortDirection }>();

    // Gérer le clic sur une colonne
    onColumnClick(column: ColumnDefinition): void {
        if (!column.sortable) return;

        let newDirection: SortDirection;
        if (this.sortColumn() === column.key) {
            newDirection = this.sortDirection() === 'asc' ? 'desc' : this.sortDirection() === 'desc' ? null : 'asc';
        } else {
            newDirection = 'asc';
        }

        this.sort.emit({ column: newDirection ? column.key : '', direction: newDirection });
    }

    // Obtenir l'icône de tri
    getSortIcon(columnKey: string): string {
        if (this.sortColumn() !== columnKey) return 'fa-sort text-gray-300 opacity-50 group-hover:opacity-100';
        return this.sortDirection() === 'asc' 
            ? 'fa-sort-up text-primary-600 dark:text-primary-400 scale-110' 
            : 'fa-sort-down text-primary-600 dark:text-primary-400 scale-110';
    }
}
