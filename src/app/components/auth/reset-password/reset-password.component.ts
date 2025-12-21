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
    email: string = '';
    otpStatus: 'pending' | 'valid' | 'invalid' | 'expired' = 'pending';
    otpMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private authService: AuthService,
        private notification: NotificationService,
        private router: Router
    ) {
        this.email = this.route.snapshot.queryParamMap.get('email') || '';
        this.resetForm = this.fb.group({
            email: [this.email, [Validators.required, Validators.email]],
            otpCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
            newPassword: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(8)]],
            confirmPassword: [{ value: '', disabled: true }, [Validators.required]]
        }, { validators: this.passwordsMatchValidator });
    }
    private updatePasswordFieldsState() {
        if (this.otpStatus === 'valid') {
            this.newPassword?.enable();
            this.confirmPassword?.enable();
        } else {
            this.newPassword?.disable();
            this.confirmPassword?.disable();
        }
    }

    get emailControl() {
        return this.resetForm.get('email');
    }
    get otpCode() {
        return this.resetForm.get('otpCode');
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

    onVerifyOtp() {
        const { email, otpCode } = this.resetForm.value;
        if (!email || !otpCode || this.otpCode?.invalid) {
            this.otpStatus = 'invalid';
            this.otpMessage = 'Veuillez saisir un code valide.';
            return;
        }
        this.isLoading = true;
        this.authService.verifyOtp(email, otpCode).subscribe({
            next: (res) => {
                if (res.valid) {
                    this.otpStatus = 'valid';
                    this.otpMessage = 'Code OTP valide.';
                    this.updatePasswordFieldsState();
                } else if (res.expired) {
                    this.otpStatus = 'expired';
                    this.otpMessage = 'Code OTP expiré.';
                    this.updatePasswordFieldsState();
                } else {
                    this.otpStatus = 'invalid';
                    this.otpMessage = res.message || 'Code OTP invalide.';
                    this.updatePasswordFieldsState();
                }
                this.isLoading = false;
            },
            error: (err) => {
                this.otpStatus = 'invalid';
                this.otpMessage = err?.message || 'Erreur lors de la vérification.';
                this.updatePasswordFieldsState();
                this.isLoading = false;
            }
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.resetForm.invalid || this.otpStatus !== 'valid') {
            this.notification.error(this.otpStatus === 'valid' ? 'Formulaire invalide.' : this.otpMessage || 'Veuillez vérifier le code OTP.');
            return;
        }
        this.isLoading = true;
        const { email, otpCode, newPassword } = this.resetForm.value;
        this.authService.resetPasswordWithOtp(email, otpCode, newPassword).subscribe({
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
