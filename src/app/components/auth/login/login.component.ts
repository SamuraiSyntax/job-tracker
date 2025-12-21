import { Component, inject, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, NotificationService } from '@services/index';
import * as bcrypt from 'bcryptjs';
import { AuthCardComponent, FormFieldErrorComponent } from '@shared/index';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthCardComponent, FormFieldErrorComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  hidePassword = true;

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const formValue = this.loginForm.value;
      // Envoyer le mot de passe en clair au backend
      this.authService.login(formValue)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
        next: (response) => {
          this.authService['handleAuthentication'](response);
          this.notificationService.success('Connexion réussie ! Bienvenue <i class="fas fa-party-horn"></i>');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.notificationService.error(error.message || 'Email ou mot de passe incorrect');
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
      this.notificationService.warning('Veuillez remplir correctement tous les champs');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
