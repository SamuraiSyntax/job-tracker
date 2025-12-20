import { Component, input, output, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '@models/index';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private themeService = inject(ThemeService);

  currentUser = input<User | null>(null);
  appTitle = input<string>('Job Tracker');
  notificationCount = input<number>(0);

  toggleMenu = output<void>();
  logoutClick = output<void>();
  notificationsClick = output<void>();
  profileClick = output<void>();
  
  showUserMenu = signal(false);

  currentTheme = this.themeService.currentTheme;
  effectiveTheme = this.themeService.effectiveTheme;

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  onLogout(): void {
    this.logoutClick.emit();
  }

  onNotifications(): void {
    this.notificationsClick.emit();
  }

  onProfile(): void {
    this.profileClick.emit();
  }

  onSettings(): void {
    // Navigation vers les paramètres (peut être géré par le parent)
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    const prenom = user.prenom?.charAt(0) || '';
    const nom = user.nom?.charAt(0) || '';
    return `${prenom}${nom}`.toUpperCase();
  });
}
