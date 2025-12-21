import { Component, inject, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { passwordComplexityValidator } from '@core/utils/form-validators.utils';
import { Router, RouterModule } from '@angular/router';
import { AuthService, NotificationService } from '@services/index';
import * as bcrypt from 'bcryptjs';
import { AuthCardComponent, FormFieldErrorComponent } from '@shared/index';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthCardComponent, FormFieldErrorComponent],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  registerForm: FormGroup = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      passwordComplexityValidator()
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordsMatchValidator });

  // Validateur pour vérifier que les deux mots de passe sont identiques
  private passwordsMatchValidator(formGroup: FormGroup): null | object {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }
  get passwordStrength(): number {
    const value = this.registerForm.get('password')?.value || '';
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) score++;
    return score;
  }

  get passwordErrors(): string[] {
    const errors = this.registerForm.get('password')?.errors;
    if (!errors) return [];
    const messages: string[] = [];
    if (errors['required']) messages.push('Le mot de passe est requis.');
    if (errors['minLength']) messages.push('Au moins 8 caractères.');
    if (errors['uppercase']) messages.push('Au moins une majuscule.');
    if (errors['lowercase']) messages.push('Au moins une minuscule.');
    if (errors['digit']) messages.push('Au moins un chiffre.');
    if (errors['special']) messages.push('Au moins un caractère spécial.');
    return messages;
  }

  isLoading = false;
  hidePassword = true;

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { nom, prenom, email, password } = this.registerForm.value;
      // Envoyer uniquement le mot de passe principal au backend
      this.authService.register({ nom, prenom, email, password })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.authService['handleAuthentication'](response);
            this.notificationService.success('Inscription réussie ! Bienvenue <i class="fas fa-party-horn"></i>');
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.notificationService.error(error.message || "Une erreur est survenue lors de l'inscription");
            this.isLoading = false;
          }
        });
    } else {
      this.markFormGroupTouched(this.registerForm);
      if (this.registerForm.errors?.['passwordsMismatch']) {
        this.notificationService.warning('Les mots de passe ne correspondent pas');
      } else {
        this.notificationService.warning('Veuillez remplir correctement tous les champs');
      }
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
