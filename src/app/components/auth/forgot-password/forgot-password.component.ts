import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthCardComponent, FormFieldErrorComponent } from '@app/components/shared';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, AuthCardComponent, FormFieldErrorComponent],
    templateUrl: './forgot-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
    forgotForm: FormGroup;
    isLoading = false;
    submitted = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private notification: NotificationService,
        private router: Router
    ) {
        this.forgotForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    get email() {
        return this.forgotForm.get('email');
    }

    onSubmit() {
        this.submitted = true;
        if (this.forgotForm.invalid) return;
        this.isLoading = true;
        // À adapter selon l'API backend
        this.authService.forgotPassword(this.email?.value).subscribe({
            next: () => {
                this.notification.success('Un email de réinitialisation a été envoyé si l’adresse existe.');
                this.isLoading = false;
                this.router.navigate(['/auth/reset-password'], { queryParams: { email: this.email?.value } });
            },
            error: () => {
                this.notification.error('Erreur lors de la demande de réinitialisation.');
                this.isLoading = false;
            }
        });
    }
}
