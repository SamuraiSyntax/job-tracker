import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatutCandidature, Priorite, TypeContrat } from '@models/index';
import { getStatutLabel, getPrioriteLabel, getTypeContratLabel } from '@core/utils';
import { FilterChipsData } from '@models/index';

@Component({
    selector: 'app-filter-chips',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './filter-chips.component.html'
})
export class FilterChipsComponent {
    // Inputs
    filters = input.required<FilterChipsData>();

    // Outputs
    clearSearch = output<void>();
    clearStatut = output<void>();
    clearPriorite = output<void>();
    clearTypeContrat = output<void>();
    clearScore = output<void>();
    clearDateDebut = output<void>();
    clearDateFin = output<void>();

    // Helper methods
    getStatutBadgeClass(statut: StatutCandidature | ''): string {
        if (!statut) return '';
        return `status-${statut}`;
    }

    getPrioriteBadgeClass(priorite: Priorite | ''): string {
        if (!priorite) return '';
        const colors: Record<Priorite, string> = {
            [Priorite.HAUTE]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            [Priorite.MOYENNE]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            [Priorite.BASSE]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        };
        return colors[priorite as Priorite] || '';
    }

    getTypeContratBadgeClass(type: TypeContrat | ''): string {
        if (!type) return '';
        const colors: Record<TypeContrat, string> = {
            [TypeContrat.CDI]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            [TypeContrat.CDD]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            [TypeContrat.FREELANCE]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            [TypeContrat.STAGE]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            [TypeContrat.ALTERNANCE]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
            [TypeContrat.INTERIM]: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
        };
        return colors[type as TypeContrat] || '';
    }

    // Expose utility functions
    readonly getStatutLabel = getStatutLabel;
    readonly getPrioriteLabel = getPrioriteLabel;
    readonly getTypeContratLabel = getTypeContratLabel;

    // Safe wrapper methods for template (handle empty values)
    getPrioriteLabelSafe(priorite: Priorite | ''): string {
        return priorite ? getPrioriteLabel(priorite as Priorite) : '';
    }

    getTypeContratLabelSafe(type: TypeContrat | ''): string {
        return type ? getTypeContratLabel(type as TypeContrat) : '';
    }
}
