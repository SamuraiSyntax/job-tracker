import { Component, inject, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, map, of, startWith, forkJoin } from 'rxjs';
import { StatistiqueService } from '@services/statistique.service';
import { CandidatureService } from '@services/candidature.service';
import { TypeContrat, Priorite } from '@models/index';
import { NotificationService } from '@services/notification.service';
import { LoadingSpinnerComponent, ErrorCardComponent } from '@shared/index';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { getHttpErrorMessage, STATS_ERROR_MESSAGES, formatDateToLocalString } from '@core/utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, ErrorCardComponent, StatusBadgeComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private statistiqueService = inject(StatistiqueService);
  private candidatureService = inject(CandidatureService);
  private notificationService = inject(NotificationService);

  private dashboardState = toSignal(
    forkJoin({
      stats: this.statistiqueService.getStatistiquesGlobales(),
      candidatures: this.candidatureService.getAllCandidatures()
    }).pipe(
      map(result => ({
        stats: result.stats,
        allCandidatures: result.candidatures,
        recentCandidatures: result.candidatures
          .sort((a, b) => new Date(b.dateCandidature).getTime() - new Date(a.dateCandidature).getTime())
          .slice(0, 5),
        loading: false,
        error: null
      })),
      catchError(error => {
        console.error('Erreur lors du chargement du dashboard', error);
        const message = getHttpErrorMessage(error, STATS_ERROR_MESSAGES, 'Impossible de charger les données.');
        return of({ stats: null, recentCandidatures: [], allCandidatures: [], loading: false, error: message });
      }),
      startWith({ stats: null, recentCandidatures: [], allCandidatures: [], loading: true, error: null })
    ),
    { requireSync: true }
  );

  stats = computed(() => this.dashboardState().stats);
  recentCandidatures = computed(() => this.dashboardState().recentCandidatures);
  allCandidatures = computed(() => this.dashboardState().allCandidatures);
  isLoading = computed(() => this.dashboardState().loading);
  errorMessage = computed(() => this.dashboardState().error);

  // Statistiques avancées computed
  scoreStats = computed(() => {
    const candidatures = this.allCandidatures().filter(c => c.score && c.score > 0);
    if (candidatures.length === 0) return { average: 0, count: 0 };
    const average = candidatures.reduce((sum, c) => sum + (c.score || 0), 0) / candidatures.length;
    return { average: Math.round(average * 10) / 10, count: candidatures.length };
  });

  typeContratStats = computed(() => {
    const candidatures = this.allCandidatures();
    const total = candidatures.length;
    if (total === 0) return [];

    const stats = candidatures.reduce((acc, c) => {
      if (c.typeContrat) {
        acc[c.typeContrat] = (acc[c.typeContrat] || 0) + 1;
      }
      return acc;
    }, {} as Record<TypeContrat, number>);

    return Object.entries(stats)
      .map(([type, count]) => ({
        type: type as TypeContrat,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  });

  prioriteStats = computed(() => {
    const candidatures = this.allCandidatures();
    const total = candidatures.filter(c => c.priorite).length;
    if (total === 0) return [];

    const stats = candidatures.reduce((acc, c) => {
      if (c.priorite) {
        acc[c.priorite] = (acc[c.priorite] || 0) + 1;
      }
      return acc;
    }, {} as Record<Priorite, number>);

    return Object.entries(stats)
      .map(([priorite, count]) => ({
        priorite: priorite as Priorite,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  });

  topCandidatures = computed(() => {
    return this.allCandidatures()
      .filter(c => c.score && c.score > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 5);
  });

  prioriteCandidatures = computed(() => {
    return this.allCandidatures()
      .filter(c => c.priorite === Priorite.HAUTE)
      .sort((a, b) => new Date(b.dateCandidature).getTime() - new Date(a.dateCandidature).getTime())
      .slice(0, 5);
  });

  relancesCandidatures = computed(() => {
    const now = new Date();
    return this.allCandidatures()
      .filter(c => c.dateRelancePrevue && new Date(c.dateRelancePrevue) >= now)
      .sort((a, b) => new Date(a.dateRelancePrevue!).getTime() - new Date(b.dateRelancePrevue!).getTime())
      .slice(0, 5);
  });

  constructor() {
    effect(() => {
      const error = this.errorMessage();
      if (error) {
        this.notificationService.error(error);
      }
    });
  }

  loadData(): void {
    window.location.reload();
  }

  formatDate(date: Date | string): string {
    return formatDateToLocalString(date);
  }

  getTypeContratColor(type: TypeContrat): string {
    const colors: Record<TypeContrat, string> = {
      [TypeContrat.CDI]: 'blue',
      [TypeContrat.CDD]: 'purple',
      [TypeContrat.FREELANCE]: 'green',
      [TypeContrat.STAGE]: 'yellow',
      [TypeContrat.ALTERNANCE]: 'indigo',
      [TypeContrat.INTERIM]: 'pink'
    };
    return colors[type] || 'gray';
  }

  getPrioriteColor(priorite: Priorite): string {
    const colors: Record<Priorite, string> = {
      [Priorite.HAUTE]: 'red',
      [Priorite.MOYENNE]: 'yellow',
      [Priorite.BASSE]: 'green'
    };
    return colors[priorite] || 'gray';
  }
}
