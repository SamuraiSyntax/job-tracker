import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, catchError, map, of, startWith } from 'rxjs';
import { StatistiqueService } from '@services/statistique.service';
import { CandidatureService } from '@services/candidature.service';
import { TypeContrat, Priorite } from '@models/index';
import { LoadingSpinnerComponent, ErrorCardComponent } from '@shared/index';
import { StatsOverviewCardsComponent } from './components/stats-overview-cards/stats-overview-cards.component';
import { DailyChartComponent } from './components/daily-chart/daily-chart.component';
import { StatsSummaryComponent } from './components/stats-summary/stats-summary.component';
import { getHttpErrorMessage, STATS_ERROR_MESSAGES } from '@core/utils';

@Component({
  selector: 'app-candidature-stats',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    ErrorCardComponent,
    StatsOverviewCardsComponent,
    DailyChartComponent,
    StatsSummaryComponent
  ],
  templateUrl: './candidature-stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureStatsComponent {
  private statistiqueService = inject(StatistiqueService);
  private candidatureService = inject(CandidatureService);
  
  private statsState = toSignal(
    forkJoin({
      globales: this.statistiqueService.getStatistiquesGlobales(),
      journalieres: this.statistiqueService.getStatistiquesParJour(),
      candidatures: this.candidatureService.getAllCandidatures()
    }).pipe(
      map(result => ({ 
        globales: result.globales, 
        journalieres: result.journalieres,
        candidatures: result.candidatures,
        loading: false, 
        error: '' 
      })),
      catchError(error => of({ 
        globales: null, 
        journalieres: [],
        candidatures: [],
        loading: false, 
        error: getHttpErrorMessage(error, STATS_ERROR_MESSAGES, 'Impossible de charger les statistiques.') 
      })),
      startWith({ globales: null, journalieres: [], candidatures: [], loading: true, error: '' })
    ),
    { requireSync: true }
  );
  
  stats = computed(() => this.statsState().globales);
  dailyStats = computed(() => this.statsState().journalieres);
  candidatures = computed(() => this.statsState().candidatures);
  isLoading = computed(() => this.statsState().loading);
  errorMessage = computed(() => this.statsState().error);

  // Statistiques avancées
  typeContratStats = computed(() => {
    const candidatures = this.candidatures();
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
    const candidatures = this.candidatures();
    const total = candidatures.filter(c => c.priorite).length;
    if (total === 0) return [];

    const statsMap = candidatures.reduce((acc, c) => {
      if (c.priorite) {
        if (!acc[c.priorite]) {
          acc[c.priorite] = { total: 0, acceptees: 0 };
        }
        acc[c.priorite].total++;
        if (c.statut === 'OFFRE') {
          acc[c.priorite].acceptees++;
        }
      }
      return acc;
    }, {} as Record<Priorite, { total: number, acceptees: number }>);

    return Object.entries(statsMap)
      .map(([priorite, data]) => ({
        priorite: priorite as Priorite,
        count: data.total,
        percentage: Math.round((data.total / total) * 100),
        tauxConversion: data.total > 0 ? Math.round((data.acceptees / data.total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  });

  scoreStats = computed(() => {
    const candidatures = this.candidatures().filter(c => c.score && c.score > 0);
    if (candidatures.length === 0) return { average: 0, count: 0, distribution: [] };

    const average = candidatures.reduce((sum, c) => sum + (c.score || 0), 0) / candidatures.length;
    
    // Distribution par score
    const distribution = [1, 2, 3, 4, 5].map(score => ({
      score,
      count: candidatures.filter(c => c.score === score).length,
      percentage: Math.round((candidatures.filter(c => c.score === score).length / candidatures.length) * 100)
    }));

    return { 
      average: Math.round(average * 10) / 10, 
      count: candidatures.length,
      distribution 
    };
  });

  tauxReponse = computed(() => {
    const candidatures = this.candidatures();
    const total = candidatures.length;
    if (total === 0) return 0;

    const avecReponse = candidatures.filter(c => 
      c.statut !== 'APPLIQUEE' && c.statut !== 'SANS_REPONSE'
    ).length;

    return Math.round((avecReponse / total) * 100);
  });

  tauxEntretien = computed(() => {
    const candidatures = this.candidatures();
    const total = candidatures.length;
    if (total === 0) return 0;

    const entretiens = candidatures.filter(c => 
      c.statut === 'ENTRETIEN_TELEPHONIQUE' || 
      c.statut === 'ENTRETIEN_TECHNIQUE' || 
      c.statut === 'ENTRETIEN_RH' ||
      c.statut === 'OFFRE'
    ).length;

    return Math.round((entretiens / total) * 100);
  });

  tauxAcceptation = computed(() => {
    const candidatures = this.candidatures();
    const total = candidatures.length;
    if (total === 0) return 0;

    const offres = candidatures.filter(c => c.statut === 'OFFRE').length;
    return Math.round((offres / total) * 100);
  });

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

  onRetry(): void {
    window.location.reload();
  }
}
