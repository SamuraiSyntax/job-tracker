import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthService, NotificationService, ThemeService, UserDataService, ConfirmationService, NavigationService } from '@services/index';
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

  private userDataService = inject(UserDataService);
  private confirmationService = inject(ConfirmationService);
  private navigationService = inject(NavigationService);

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
    // Vérifie l'authentification et la validité du token dès l'accès à la page
    if (!this.authService.isAuthenticated()) {
      this.notificationService.error('Votre session a expiré ou vous n’êtes pas authentifié. Veuillez vous reconnecter.');
      // Redirige vers la page de connexion
      window.setTimeout(() => {
        window.location.href = '/auth/login';
      }, 100);
      return;
    }
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
    if (!this.authService.isAuthenticated()) {
      this.notificationService.error('Vous devez être connecté pour exporter vos données.');
      return;
    }
    this.userDataService.exportUser().subscribe({
      next: (blob) => {
        if (!blob) {
          this.notificationService.error('Aucune donnée à exporter.');
          return;
        }
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mes-donnees-jobtracker.json';
        a.click();
        window.URL.revokeObjectURL(url);
        this.notificationService.success('Export réussi !');
      },
      error: (err) => {
        if (err.status === 401) {
          this.notificationService.error('Session expirée ou non authentifié. Veuillez vous reconnecter.');
        } else {
          this.notificationService.error('Erreur lors de l\'export des données');
        }
      }
    });
  }

  onImportData(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.confirmationService.confirm({
      title: 'Importer mes données',
      message: 'Cette opération va écraser vos données utilisateur actuelles (hors email/mot de passe). Voulez-vous continuer ?',
      confirmText: 'Oui, importer',
      cancelText: 'Annuler',
      type: 'warning',
    }).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userDataService.importUser(file).subscribe({
          next: () => this.notificationService.success('Import réussi !'),
          error: () => this.notificationService.error('Erreur lors de l\'import des données')
        });
      }
    });
  }

  onDeleteAccount(): void {
    this.confirmationService.confirm({
      title: 'Supprimer mon compte',
      message: 'Voulez-vous exporter vos données avant de supprimer votre compte ? Cette action est irréversible.',
      confirmText: 'Exporter et supprimer',
      cancelText: 'Supprimer sans exporter',
      type: 'danger'
    }).subscribe((exportAndDelete: boolean) => {
      if (exportAndDelete) {
        // Exporter d'abord
        this.onExportData();
        setTimeout(() => this.deleteAccountRequest(), 1000); // Laisse le temps au téléchargement
      } else {
        this.deleteAccountRequest();
      }
    });
  }

  private deleteAccountRequest(): void {
    this.userDataService.deleteUser().subscribe({
      next: () => {
        // Déconnexion et redirection dès le succès
        this.authService.logout();
      },
      error: () => {
        // Déconnexion et redirection même en cas d'erreur
        this.authService.logout();
      },
      complete: () => {
        // Sécurité : on s'assure que la redirection a bien lieu
        // (évite tout blocage si le flux est terminé sans next/error)
        this.authService.logout();
      }
    });
  }
}
