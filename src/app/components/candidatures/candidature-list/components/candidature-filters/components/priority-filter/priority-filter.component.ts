import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Priorite } from '@models/index';
import { getPrioriteLabel } from '@core/utils/priorite.utils';

@Component({
    selector: 'app-priority-filter',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './priority-filter.component.html'
})
export class PriorityFilterComponent {
    // Input - valeur depuis le parent
    selectedPriorite = input<Priorite | ''>('');

    // Output - changement vers le parent
    prioriteChange = output<Priorite | ''>();

    // État local pour le dropdown
    showDropdown = signal(false);

    // Données
    priorites = Object.values(Priorite);

    // Fonctions utilitaires
    getPrioriteLabel = getPrioriteLabel;

    // Toggle du dropdown
    toggleDropdown(): void {
        this.showDropdown.update(v => !v);
    }

    // Sélectionner une priorité
    selectPriorite(priorite: Priorite | ''): void {
        this.prioriteChange.emit(priorite);
        this.showDropdown.set(false);
    }

    // Badge class
    getPrioriteBadgeClass(priorite: Priorite | ''): string {
        if (!priorite) return '';
        const colors: Record<Priorite, string> = {
            [Priorite.HAUTE]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            [Priorite.MOYENNE]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            [Priorite.BASSE]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        };
        return colors[priorite as Priorite] || '';
    }

    // Label avec fallback
    getPrioriteLabelOrAll(priorite: Priorite | ''): string {
        return priorite ? this.getPrioriteLabel(priorite) : 'Toutes les priorités';
    }
}
