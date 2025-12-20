import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorCardComponent {
  title = input<string>('Une erreur est survenue');
  message = input<string>('');
  icon = input<string>('error_outline');
  showRetry = input<boolean>(true);
  retryLabel = input<string>('Réessayer');
  compact = input<boolean>(false);
  
  retry = output<void>();
}
