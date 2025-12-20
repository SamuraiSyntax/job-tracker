import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatistiquesGlobales } from '@models/index';

@Component({
  selector: 'app-stats-overview-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-overview-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsOverviewCardsComponent {
  stats = input.required<StatistiquesGlobales>();
}
