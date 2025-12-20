import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Priorite } from '@models/index';
import { getPrioriteConfig } from '@core/utils';

@Component({
  selector: 'app-priorite-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './priorite-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrioriteBadgeComponent {
  priorite = input.required<Priorite>();
  
  config = computed(() => getPrioriteConfig(this.priorite()));
  
  badgeClass = computed(() => {
    const color = this.config().color;
    const colorMap: Record<string, string> = {
      'red': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'yellow': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'gray': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap['gray'];
  });
}
