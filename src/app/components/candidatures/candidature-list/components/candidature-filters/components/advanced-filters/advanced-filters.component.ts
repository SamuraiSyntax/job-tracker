import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TypeContrat } from '@models/index';
@Component({
    selector: 'app-advanced-filters',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './advanced-filters.component.html'
})
export class AdvancedFiltersComponent {
    // Inputs - valeurs depuis le parent
    selectedScoreMin = input<number>(0);
    selectedScoreMax = input<number>(5);
    dateDebut = input<string>('');
    dateFin = input<string>('');
    showArchivedCandidatures = input<boolean>(false);
    showNonArchivedCandidatures = input<boolean>(true);
    activeFiltersCount = input<number>(0);

    // Outputs - événements vers le parent
    scoreMinChange = output<number>();
    scoreMaxChange = output<number>();
    dateDebutChange = output<string>();
    dateFinChange = output<string>();
    archivedChange = output<boolean>();
    nonArchivedChange = output<boolean>();
    clearFilters = output<void>();

    // État local pour l'expansion
    showAdvancedFilters = signal(false);

    // Données
    typesContrat = Object.values(TypeContrat);

    // Toggle des dropdowns
    toggleAdvancedFilters(): void {
        this.showAdvancedFilters.update(v => !v);
    }

    // Émettre les changements
    onScoreMinChange(value: number): void {
        this.scoreMinChange.emit(value);
    }

    onScoreMaxChange(value: number): void {
        this.scoreMaxChange.emit(value);
    }

    onDateDebutChange(value: string): void {
        this.dateDebutChange.emit(value);
    }

    onDateFinChange(value: string): void {
        this.dateFinChange.emit(value);
    }

    onArchivedChange(value: boolean): void {
        this.archivedChange.emit(value);
    }

    onNonArchivedChange(value: boolean): void {
        this.nonArchivedChange.emit(value);
    }

    onClearFilters(): void {
        this.clearFilters.emit();
    }
}
