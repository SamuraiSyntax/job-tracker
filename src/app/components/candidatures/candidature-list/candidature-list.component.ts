import { Component, inject, signal, computed, effect, DestroyRef } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, map, of, startWith, switchMap, Subject } from 'rxjs';
import { CandidatureService, NotificationService, ConfirmationService } from '@services/index';
import { Candidature, StatutCandidature, FilterChipsData, ColumnDefinition, SortDirection, TypeContrat, Priorite } from '@models/index';
import { LoadingSpinnerComponent, ErrorCardComponent, EmptyStateComponent } from '@shared/index';
import { sortByKey, SortOrder } from '@core/utils';
import { CandidatureFiltersComponent } from './components/candidature-filters/candidature-filters.component';
import { FilterChipsComponent } from './components/filter-chips/filter-chips.component';
import { CandidatureTableComponent } from './components/candidature-table/candidature-table.component';
import { CandidatureCardComponent } from './components/candidature-card/candidature-card.component';
import { getStatutBadgeClass, getStatutLabel, getPrioriteBadgeClass, getPrioriteLabel, getTypeContratBadgeClass, getTypeContratLabel } from '@core/utils/index';

@Component({
  selector: 'app-candidature-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    ErrorCardComponent,
    EmptyStateComponent,
    CandidatureFiltersComponent,
    FilterChipsComponent,
    CandidatureTableComponent,
    CandidatureCardComponent
  ],
  templateUrl: './candidature-list.component.html'
})
export class CandidatureListComponent {
  // Optimisation : mise à jour locale d'une candidature après édition inline
  private updateCandidatureLocally(updated: Candidature) {
    this.candidaturesState.set({
      ...this.candidaturesState(),
      data: this.candidaturesState().data.map((c: Candidature) => c.id === updated.id ? { ...c, ...updated } : c)
    });
  }

  private candidatureService = inject(CandidatureService);
  router = inject(Router);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);

  private readonly STORAGE_KEY = 'job-tracker-columns-preferences';
  private refreshTrigger$ = new Subject<void>();

  // État des candidatures avec toSignal
  private candidaturesState = signal<{ data: Candidature[]; loading: boolean; error: string | null }>(
    { data: [], loading: true, error: null }
  );

  // Initialisation et rafraîchissement des candidatures (remplace toSignal)
  constructor() {
    effect(() => {
      const columns = this.availableColumns();
      this.saveColumnPreferences(columns);
    });

    // Charger les préférences au démarrage
    this.loadColumnPreferences();

    // Charger les candidatures au démarrage
    this.loadCandidatures();
  }

  loadCandidatures(): void {
    this.candidaturesState.set({ ...this.candidaturesState(), loading: true });
    this.candidatureService.getAllCandidatures().pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error('Erreur lors du chargement des candidatures', error);
        const errorMsg = 'Impossible de charger les candidatures. Veuillez vérifier que le serveur est bien démarré.';
        setTimeout(() => this.notificationService.error(errorMsg), 0);
        this.candidaturesState.set({ data: [], loading: false, error: errorMsg });
        return of([]);
      })
    ).subscribe(data => {
      this.candidaturesState.set({ data, loading: false, error: null });
    });
  }

  // Données avec signals computed depuis l'état
  candidatures = computed(() => this.candidaturesState().data);
  isLoading = computed(() => this.candidaturesState().loading);
  errorMessage = computed(() => this.candidaturesState().error);

  viewMode = signal<'table' | 'grid'>('table');
  // Recherche et filtres avec signals
  searchTerm = signal('');
  selectedStatut = signal<StatutCandidature | ''>('');
  selectedPriorite = signal<Priorite | ''>('');
  selectedTypeContrat = signal<TypeContrat | ''>('');
  selectedScoreMin = signal<number>(0);
  selectedScoreMax = signal<number>(5);
  showArchived = signal<boolean>(false);
  showNonArchived = signal<boolean>(true);
  dateDebut = signal<string>('');
  dateFin = signal<string>('');

  // Tri avec signals
  sortColumn = signal<string | null>(null);
  sortDirection = signal<SortDirection>(null);

  availableColumns = signal<ColumnDefinition[]>([
    { key: 'id', label: 'ID', visible: false, sortable: true, width: '80px', icon: 'fa-hashtag' },
    { key: 'entreprise', label: 'Entreprise', visible: true, sortable: true, icon: 'fa-building' },
    { key: 'poste', label: 'Poste', visible: true, sortable: true, icon: 'fa-briefcase' },
    { key: 'localisation', label: 'Localisation', visible: true, sortable: true, icon: 'fa-map-marker-alt' },
    { key: 'typeContrat', label: 'Type contrat', visible: true, sortable: true, icon: 'fa-file-contract' },
    { key: 'dateCandidature', label: 'Date candidature', visible: true, sortable: true, icon: 'fa-calendar' },
    { key: 'statut', label: 'Statut', visible: true, sortable: true, icon: 'fa-flag' },
    { key: 'priorite', label: 'Priorité', visible: true, sortable: true, icon: 'fa-exclamation-triangle' },
    { key: 'salaire', label: 'Salaire', visible: false, sortable: false, icon: 'fa-euro-sign' },
    { key: 'score', label: 'Score', visible: true, sortable: true, icon: 'fa-star' },
    { key: 'source', label: 'Source', visible: false, sortable: true, icon: 'fa-link' },
    { key: 'contact', label: 'Contact', visible: false, sortable: false, icon: 'fa-user' },
    { key: 'description', label: 'Description/Note', visible: false, sortable: false, icon: 'fa-align-left' },
    { key: 'lienOffre', label: 'Lien offre', visible: false, sortable: false, icon: 'fa-external-link-alt' },
    { key: 'actions', label: 'Actions', visible: true, sortable: false, width: '140px', icon: 'fa-cog' }
  ]);

  // Computed signals
  visibleColumns = computed(() =>
    this.availableColumns().filter(col => col.visible)
  );

  visibleColumnsSet = computed(() =>
    new Set(this.visibleColumns().map(col => col.key))
  );

  filterChipsData = computed<FilterChipsData>(() => ({
    searchTerm: this.searchTerm(),
    selectedStatut: this.selectedStatut(),
    selectedPriorite: this.selectedPriorite(),
    selectedTypeContrat: this.selectedTypeContrat(),
    selectedScoreMin: this.selectedScoreMin(),
    selectedScoreMax: this.selectedScoreMax(),
    dateDebut: this.dateDebut(),
    dateFin: this.dateFin()
  }));

  filteredCandidatures = computed(() => {
    let result = this.candidatures();

    // Filtre par recherche textuelle
    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      result = result.filter(c =>
        c.entreprise?.toLowerCase().includes(search) ||
        c.poste?.toLowerCase().includes(search) ||
        c.localisation?.toLowerCase().includes(search) ||
        c.source?.toLowerCase().includes(search) ||
        c.description?.toLowerCase().includes(search)
      );
    }

    // Filtre par statut
    if (this.selectedStatut()) {
      result = result.filter(c => c.statut === this.selectedStatut());
    }

    // Filtre par priorité
    if (this.selectedPriorite()) {
      result = result.filter(c => c.priorite === this.selectedPriorite());
    }

    // Filtre par type de contrat
    if (this.selectedTypeContrat()) {
      result = result.filter(c => c.typeContrat === this.selectedTypeContrat());
    }

    // Filtre par score
    if (this.selectedScoreMin() > 0 || this.selectedScoreMax() < 5) {
      result = result.filter(c => {
        const score = c.score || 0;
        return score >= this.selectedScoreMin() && score <= this.selectedScoreMax();
      });
    }

    // Filtre par plage de dates
    if (this.dateDebut()) {
      const dateMin = new Date(this.dateDebut());
      result = result.filter(c => new Date(c.dateCandidature) >= dateMin);
    }
    if (this.dateFin()) {
      const dateMax = new Date(this.dateFin());
      result = result.filter(c => new Date(c.dateCandidature) <= dateMax);
    }

    // Filtre archivées/non archivées
    const showArchived = this.showArchived();
    const showNonArchived = this.showNonArchived();
    result = result.filter(c =>
      (showNonArchived && !c.archivee) ||
      (showArchived && c.archivee)
    );

    // Tri avec type safety
    const sortCol = this.sortColumn();
    const sortDir = this.sortDirection();
    if (sortCol && sortDir) {
      result = sortByKey(result, sortCol as keyof Candidature, sortDir as SortOrder);
    }

    return result;
  });

  hasActiveFilters = computed(() =>
    !!this.searchTerm() ||
    !!this.selectedStatut() ||
    !!this.selectedPriorite() ||
    !!this.selectedTypeContrat() ||
    this.selectedScoreMin() > 0 ||
    this.selectedScoreMax() < 5 ||
    !!this.dateDebut() ||
    !!this.dateFin()
  );

  activeFiltersCount = computed(() => {
    let count = 0;
    if (this.searchTerm()) count++;
    if (this.selectedStatut()) count++;
    if (this.selectedPriorite()) count++;
    if (this.selectedTypeContrat()) count++;
    if (this.selectedScoreMin() > 0 || this.selectedScoreMax() < 5) count++;
    if (this.dateDebut()) count++;
    if (this.dateFin()) count++;
    return count;
  });

  readonly Priorite = Priorite;
  readonly TypeContrat = TypeContrat;
  getStatutBadgeClass = getStatutBadgeClass;
  getStatutLabel = getStatutLabel;
  getPrioriteBadgeClass = getPrioriteBadgeClass;
  getPrioriteLabel = getPrioriteLabel;
  getTypeContratBadgeClass = getTypeContratBadgeClass;
  getTypeContratLabel = getTypeContratLabel;

  // Gestion des colonnes
  toggleColumn(columnKey: string): void {
    this.availableColumns.update(columns => {
      const newColumns = [...columns];
      const column = newColumns.find(col => col.key === columnKey);
      if (column && column.key !== 'actions') {
        column.visible = !column.visible;
      }
      return newColumns;
    });
  }

  resetColumns(): void {
    this.availableColumns.update(columns => {
      const defaultVisible = ['entreprise', 'poste', 'localisation', 'dateCandidature', 'statut', 'actions'];
      return columns.map(col => ({
        ...col,
        visible: defaultVisible.includes(col.key)
      }));
    });
    this.notificationService.success('Colonnes réinitialisées');
  }

  showAllColumns(): void {
    this.availableColumns.update(columns =>
      columns.map(col => ({ ...col, visible: true }))
    );
    this.notificationService.success('Toutes les colonnes affichées');
  }

  hideAllOptionalColumns(): void {
    this.availableColumns.update(columns =>
      columns.map(col => ({
        ...col,
        visible: col.key === 'poste' || col.key === 'actions'
      }))
    );
    this.notificationService.success('Colonnes optionnelles masquées (poste et actions toujours visibles)');
  }

  private saveColumnPreferences(columns: ColumnDefinition[]): void {
    const preferences = columns.map(col => ({
      key: col.key,
      visible: col.visible
    }));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
  }

  private loadColumnPreferences(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const preferences = JSON.parse(stored);
        this.availableColumns.update(columns => {
          const newColumns = [...columns];
          preferences.forEach((pref: { key: string; visible: boolean }) => {
            const column = newColumns.find(col => col.key === pref.key);
            if (column) {
              column.visible = pref.visible;
            }
          });
          return newColumns;
        });
      } catch (e) {
        console.error('Erreur lors du chargement des préférences de colonnes', e);
      }
    }
  }

  // Tri
  onSort(event: { column: string; direction: SortDirection }): void {
    this.sortColumn.set(event.direction ? event.column : null);
    this.sortDirection.set(event.direction);
  }

  sortBy(column: string): void {
    const col = this.availableColumns().find(c => c.key === column);
    if (!col || !col.sortable) return;

    const currentSort = this.sortColumn();
    const currentDir = this.sortDirection();

    if (currentSort === column) {
      // Cycle: asc -> desc -> null
      if (currentDir === 'asc') {
        this.sortDirection.set('desc');
      } else if (currentDir === 'desc') {
        this.sortDirection.set(null);
        this.sortColumn.set(null);
      }
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  getSortIcon(column: string): string {
    if (this.sortColumn() !== column) return 'fas fa-sort text-gray-300 dark:text-gray-600';
    return this.sortDirection() === 'asc'
      ? 'fas fa-sort-up text-primary-600 dark:text-primary-400'
      : 'fas fa-sort-down text-primary-600 dark:text-primary-400';
  }

  // Filtres
  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedStatut.set('');
    this.selectedPriorite.set('');
    this.selectedTypeContrat.set('');
    this.selectedScoreMin.set(0);
    this.selectedScoreMax.set(5);
    this.dateDebut.set('');
    this.dateFin.set('');
    this.showArchived.set(false);
    this.showNonArchived.set(true);
    this.notificationService.success('Filtres réinitialisés');
  }

  // Helpers
  getColumnValue(candidature: Candidature, columnKey: keyof Candidature): unknown {
    return candidature[columnKey];
  }

  // Réordonner les colonnes (drag & drop)
  onColumnsReordered(newOrder: ColumnDefinition[]): void {
    // On conserve la visibilité actuelle de chaque colonne
    const current = this.availableColumns();
    const updated = newOrder.map(col => {
      const found = current.find(c => c.key === col.key);
      return found ? { ...col, visible: found.visible } : col;
    });
    this.availableColumns.set(updated);
  }

  // Actions
  viewDetails(id: number): void {
    this.router.navigate(['/candidatures', id]);
  }

  editCandidature(id: number): void {
    this.router.navigate(['/candidatures', id, 'edit']);
  }

  deleteCandidature(id: number, event: Event): void {
    event.stopPropagation();

    const candidature = this.candidatures().find(c => c.id === id);
    if (!candidature) return;

    this.confirmationService.confirmDelete(`${candidature.poste} chez ${candidature.entreprise}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (confirmed) {
          this.candidatureService.deleteCandidature(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                setTimeout(() => this.notificationService.success('Candidature supprimée avec succès'), 0);
                this.loadCandidatures();
              },
              error: (error) => {
                console.error('Erreur lors de la suppression', error);
                setTimeout(() => this.notificationService.error('Erreur lors de la suppression'), 0);
              }
            });
        }
      });
  }

  // Édition inline - handler pour événement du composant table
  onEdit(event: { id: number; field: keyof Candidature; value: unknown }): void {
    const candidature = this.candidatures().find(c => c.id === event.id);
    if (!candidature) return;

    const updatedCandidature = { ...candidature, [event.field]: event.value };

    this.candidatureService.updateCandidature(event.id, updatedCandidature)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.notificationService.success('Candidature mise à jour');
          this.updateCandidatureLocally(updated);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour', error);
          this.notificationService.error('Erreur lors de la mise à jour');
        }
      });
  }

  // Archivage depuis le composant table
  onArchive(id: number): void {
    const candidature = this.candidatures().find(c => c.id === id);
    if (!candidature) return;

    const updatedCandidature = { ...candidature, archivee: !candidature.archivee };

    this.candidatureService.updateCandidature(id, updatedCandidature)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.notificationService.success(
            candidature.archivee ? 'Candidature désarchivée' : 'Candidature archivée'
          );
          // Mise à jour locale, pas de reload global
          this.updateCandidatureLocally(updated);
        },
        error: (error) => {
          console.error('Erreur lors de l\'archivage', error);
          this.notificationService.error('Erreur lors de l\'archivage');
        }
      });
  }

  // Handler pour la suppression depuis le composant table
  onDeleteFromTable(id: number): void {
    const candidature = this.candidatures().find(c => c.id === id);
    if (!candidature) return;

    this.confirmationService.confirmDelete(`${candidature.poste} chez ${candidature.entreprise}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (confirmed) {
          this.candidatureService.deleteCandidature(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                setTimeout(() => this.notificationService.success('Candidature supprimée avec succès'), 0);
                this.loadCandidatures();
              },
              error: (error) => {
                console.error('Erreur lors de la suppression', error);
                setTimeout(() => this.notificationService.error('Erreur lors de la suppression'), 0);
              }
            });
        }
      });
  }
}
