import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatistiquesParJour } from '@models/index';
import { formatDateToLongFrench } from '@core/utils';

@Component({
  selector: 'app-stats-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsSummaryComponent {
  dailyStats = input.required<StatistiquesParJour[]>();

  totalCandidatures = computed(() => 
    this.dailyStats().reduce((sum, day) => sum + day.total, 0)
  );

  moyenneParJour = computed(() => {
    const stats = this.dailyStats();
    if (stats.length === 0) return 0;
    return Math.round(this.totalCandidatures() / stats.length);
  });

  jourLePlusActif = computed(() => {
    const stats = this.dailyStats();
    if (stats.length === 0) return null;
    const maxDay = stats.reduce((max, day) => 
      day.total > max.total ? day : max
    );
    return { jour: formatDateToLongFrench(maxDay.jour), total: maxDay.total };
  });

  tauxConversion = computed(() => {
    const total = this.totalCandidatures();
    if (total === 0) return 0;
    const offres = this.dailyStats().reduce((sum, day) => sum + day.offres, 0);
    return Math.round((offres / total) * 100);
  });
}
