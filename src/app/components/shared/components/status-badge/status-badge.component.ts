import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatutCandidature } from '@models/index';
import { getStatutConfig } from '@core/utils';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBadgeComponent {
  statut = input.required<StatutCandidature>();
  
  config = computed(() => getStatutConfig(this.statut()));
}
