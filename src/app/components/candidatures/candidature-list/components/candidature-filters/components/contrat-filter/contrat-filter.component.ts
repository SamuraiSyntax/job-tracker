import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeContrat } from '@models/index';
import { getTypeContratLabel } from '@core/utils/type-contrat.utils';

@Component({
    selector: 'app-contrat-filter',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './contrat-filter.component.html'
})
export class ContratFilterComponent {
    selectedTypeContrat = input<TypeContrat | ''>('');

    typeContratChange = output<TypeContrat | ''>();

    showTypeContratDropdown = signal(false);

    typesContrat = Object.values(TypeContrat);

    getTypeContratLabel = getTypeContratLabel;

    toggleTypeContratDropdown(): void {
        this.showTypeContratDropdown.update(v => !v);
    }

    // Sélectionner un type de contrat
    selectTypeContrat(type: TypeContrat | ''): void {
        this.typeContratChange.emit(type);
        this.showTypeContratDropdown.set(false);
    }


    // Badge class pour type de contrat
    getTypeContratBadgeClass(type: TypeContrat | ''): string {
        if (!type) return '';
        const colors: Record<TypeContrat, string> = {
            [TypeContrat.CDI]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            [TypeContrat.CDD]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
            [TypeContrat.FREELANCE]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            [TypeContrat.STAGE]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
            [TypeContrat.ALTERNANCE]: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
            [TypeContrat.INTERIM]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        };
        return colors[type as TypeContrat] || '';
    }

    // Label avec fallback
    getTypeContratLabelOrAll(type: TypeContrat | ''): string {
        return type ? this.getTypeContratLabel(type) : 'Tous les types';
    }
}
