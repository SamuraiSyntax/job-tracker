import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { HeaderComponent, SidebarComponent, FooterComponent, ToastComponent, ConfirmationModalComponent } from '@shared/index';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ToastComponent,
    ConfirmationModalComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private authService = inject(AuthService);

  protected readonly title = signal('Job Tracker');

  isAuthenticated = computed(() => this.authService.isAuthenticated());
  currentUser = computed(() => this.authService.getCurrentUser());
  
  sidenavOpen = true;

  toggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
