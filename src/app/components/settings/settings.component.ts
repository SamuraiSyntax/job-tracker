import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthService, NotificationService, ThemeService } from '@services/index';
import { NotificationSetting, PrivacySetting } from '@models/index';
import { SwitchThemeComponent } from '@shared/components/switch-theme/switch-theme.component';
import { passwordMatchValidator, passwordComplexityValidator } from '@core/utils/form-validators.utils';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SwitchThemeComponent],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private themeService = inject(ThemeService);

  passwordForm!: FormGroup;
  isChangingPassword = signal(false);

  notificationSettings = signal<NotificationSetting[]>([
    {
      id: 'email_entretien',
      label: 'Rappels d\'entretiens',
      description: 'Recevoir des rappels pour les entretiens à venir',
      enabled: true,
      icon: 'event'
    },
    {
      id: 'email_stats',
      label: 'Rapport hebdomadaire',
      description: 'Recevoir un résumé hebdomadaire de vos candidatures',
      enabled: false,
      icon: 'bar_chart'
    },
    {
      id: 'push_notifications',
      label: 'Notifications push',
      description: 'Activer les notifications push dans le navigateur',
      enabled: false,
      icon: 'notifications_active'
    }
  ]);

  privacySettings = signal<PrivacySetting[]>([
    {
      id: 'profile_public',
      label: 'Profil public',
      description: 'Rendre votre profil visible par d\'autres utilisateurs',
      enabled: false,
      icon: 'public'
    },
    {
      id: 'analytics',
      label: 'Données analytiques',
      description: 'Autoriser la collecte de données pour améliorer l\'application',
      enabled: true,
      icon: 'analytics'
    }
  ]);

  ngOnInit(): void {
    this.initPasswordForm();
  }

  private initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        passwordComplexityValidator()
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator()
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      this.isChangingPassword.set(true);
      const formValue = this.passwordForm.value;
      // Hash du nouveau mot de passe côté client (salt faible car le vrai hash est côté serveur)
      const salt = bcrypt.genSaltSync(6);
      const hashedNewPassword = bcrypt.hashSync(formValue.newPassword, salt);
      // Ici, il faudrait appeler le service pour changer le mot de passe, par exemple :
      // this.authService.changePassword({
      //   currentPassword: formValue.currentPassword,
      //   newPassword: hashedNewPassword
      // })
      // .subscribe(...)
      // Pour l'instant, on simule :
      setTimeout(() => {
        this.notificationService.success('Mot de passe modifié avec succès');
        this.passwordForm.reset();
        this.isChangingPassword.set(false);
      }, 1500);
    }
  }
  get newPasswordStrength(): number {
    const value = this.passwordForm?.get('newPassword')?.value || '';
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) score++;
    return score;
  }

  get newPasswordErrors(): string[] {
    const errors = this.passwordForm?.get('newPassword')?.errors;
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

  onNotificationToggle(setting: NotificationSetting): void {
    this.notificationSettings.update(settings =>
      settings.map(s =>
        s.id === setting.id ? { ...s, enabled: !s.enabled } : s
      )
    );
    const updated = this.notificationSettings().find(s => s.id === setting.id);
    this.notificationService.success(`${setting.label} ${updated?.enabled ? 'activé' : 'désactivé'}`);
  }

  onPrivacyToggle(setting: PrivacySetting): void {
    this.privacySettings.update(settings =>
      settings.map(s =>
        s.id === setting.id ? { ...s, enabled: !s.enabled } : s
      )
    );
    const updated = this.privacySettings().find(s => s.id === setting.id);
    this.notificationService.success(`${setting.label} ${updated?.enabled ? 'activé' : 'désactivé'}`);
  }

  onExportData(): void {
    this.notificationService.success('Export des données en cours...');
  }

  onDeleteAccount(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      this.notificationService.error('Suppression du compte en cours...');
    }
  }
}
