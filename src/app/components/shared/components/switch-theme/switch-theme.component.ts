import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@core/services';

@Component({
  selector: 'app-switch-theme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch-theme.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchThemeComponent {
  private themeService = inject(ThemeService);

  currentTheme = this.themeService.currentTheme;
  effectiveTheme = this.themeService.effectiveTheme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
