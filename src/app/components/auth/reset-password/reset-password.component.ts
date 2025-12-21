import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthCardComponent, FormFieldErrorComponent } from '@app/components/shared';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, AuthCardComponent, FormFieldErrorComponent],
    templateUrl: './reset-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
    resetForm: FormGroup;
    isLoading = false;
    submitted = false;
    token: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private authService: AuthService,
        private notification: NotificationService,
        private router: Router
    ) {
        this.resetForm = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordsMatchValidator });
        this.token = this.route.snapshot.queryParamMap.get('token');
    }

    get newPassword() {
        return this.resetForm.get('newPassword');
    }
    get confirmPassword() {
        return this.resetForm.get('confirmPassword');
    }

    passwordsMatchValidator(form: FormGroup) {
        const password = form.get('newPassword')?.value;
        const confirm = form.get('confirmPassword')?.value;
        return password === confirm ? null : { passwordMismatch: true };
    }

    onSubmit() {
        this.submitted = true;
        if (this.resetForm.invalid || !this.token) return;
        this.isLoading = true;
        this.authService.resetPassword(this.token, this.newPassword?.value).subscribe({
            next: () => {
                this.notification.success('Votre mot de passe a été réinitialisé avec succès.');
                this.isLoading = false;
                this.router.navigate(['/auth/login']);
            },
            error: (err) => {
                this.notification.error(err?.message || 'Erreur lors de la réinitialisation.');
                this.isLoading = false;
            }
        });
    }
}
