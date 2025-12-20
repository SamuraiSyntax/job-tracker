import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  title = input<string>('Aucune donnée');
  message = input<string>('');
  icon = input<string>('inbox');
  actionLabel = input<string | undefined>();
  actionIcon = input<string | undefined>();
  
  action = output<void>();
}
