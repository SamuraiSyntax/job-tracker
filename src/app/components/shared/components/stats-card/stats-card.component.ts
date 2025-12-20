import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsCardComponent {
  title = input<string>('');
  value = input<number | string>(0);
  subtitle = input<string | undefined>();
  icon = input<string | undefined>();
  iconColor = input<string | undefined>();
  valueClass = input<string | undefined>();
  clickable = input<boolean>(false);
}
