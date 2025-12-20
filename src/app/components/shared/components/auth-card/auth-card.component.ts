import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthCardComponent {
  title = input<string>('');
  subtitle = input<string>('');
  logoUrl = input<string | undefined>();
}
