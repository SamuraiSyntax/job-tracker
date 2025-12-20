import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatutCandidature } from '@models/index';
import { getStatutLabel, getAllStatuts } from '@core/utils';

@Component({
    selector: 'app-status-filter',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './status-filter.component.html'
})
export class StatusFilterComponent {
    // Input - valeur depuis le parent
    selectedStatut = input<StatutCandidature | ''>('');

    // Output - changement vers le parent
    statutChange = output<StatutCandidature | ''>();

    // État local pour le dropdown
    showDropdown = signal(false);

    // Données
    statuts = getAllStatuts();

    // Fonctions utilitaires
    getStatutLabel = getStatutLabel;

    // Toggle du dropdown
    toggleDropdown(): void {
        this.showDropdown.update(v => !v);
    }

    // Sélectionner un statut
    selectStatut(statut: StatutCandidature | ''): void {
        this.statutChange.emit(statut);
        this.showDropdown.set(false);
    }

    // Badge class
    getStatutBadgeClass(statut: StatutCandidature | ''): string {
        if (!statut) return '';
        return `status-${statut}`;
    }

    // Label avec fallback
    getStatutLabelOrAll(statut: StatutCandidature | ''): string {
        return statut ? this.getStatutLabel(statut) : 'Tous les statuts';
    }
}
