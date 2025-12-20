import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatutCandidature, Priorite, TypeContrat } from '@models/index';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { StatusFilterComponent } from './components/status-filter/status-filter.component';
import { PriorityFilterComponent } from './components/priority-filter/priority-filter.component';
import { ContratFilterComponent } from './components/contrat-filter/contrat-filter.component';
import { AdvancedFiltersComponent } from './components/advanced-filters/advanced-filters.component';
import { ColumnSelectorComponent } from '../../components/column-selector/column-selector.component';

@Component({
    selector: 'app-candidature-filters',
    standalone: true,
    imports: [
        CommonModule,
        SearchBarComponent,
        StatusFilterComponent,
        PriorityFilterComponent,
        ContratFilterComponent,
        AdvancedFiltersComponent,
        ColumnSelectorComponent
    ],
    templateUrl: './candidature-filters.component.html'
})
export class CandidatureFiltersComponent {
    // Inputs - valeurs des filtres depuis le parent
    searchTerm = input<string>('');
    selectedStatut = input<StatutCandidature | ''>('');
    selectedPriorite = input<Priorite | ''>('');
    selectedTypeContrat = input<TypeContrat | ''>('');
    selectedScoreMin = input<number>(0);
    selectedScoreMax = input<number>(5);
    dateDebut = input<string>('');
    dateFin = input<string>('');
    showArchivedCandidatures = input<boolean>(false);
    showNonArchivedCandidatures = input<boolean>(true);
    activeFiltersCount = input<number>(0);

    // Inputs pour la gestion des colonnes
    visibleColumnsSet = input<Set<string>>(new Set());
    availableColumns = input<any[]>([]); // Type ColumnDefinition si importé

    // Outputs - événements vers le parent
    searchTermChange = output<string>();
    statutChange = output<StatutCandidature | ''>();
    prioriteChange = output<Priorite | ''>();
    typeContratChange = output<TypeContrat | ''>();
    scoreMinChange = output<number>();
    scoreMaxChange = output<number>();
    dateDebutChange = output<string>();
    dateFinChange = output<string>();
    archivedChange = output<boolean>();
    nonArchivedChange = output<boolean>();
    clearFilters = output<void>();
    // Outputs pour la gestion des colonnes
    toggleColumn = output<string>();
    showAllColumns = output<void>();
    hideAllOptionalColumns = output<void>();
    columnsReordered = output<any[]>();
    
}
