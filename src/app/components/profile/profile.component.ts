import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, NotificationService } from '@services/index';
import { User } from '@models/user.model';
import { FormFieldErrorComponent } from '@shared/index';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  profileForm!: FormGroup;
  currentUser = signal<User | null>(null);
  isLoading = signal(false);
  isEditMode = signal(false);

  // Computed signals pour les helpers
  initials = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    const prenom = user.prenom?.charAt(0) || '';
    const nom = user.nom?.charAt(0) || '';
    return `${prenom}${nom}`.toUpperCase();
  });

  roleBadgeColor = computed(() => 
    this.currentUser()?.role === 'ADMIN' ? 'accent' : 'primary'
  );

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser.set(user);
    
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.initForm();
  }

  private initForm(): void {
    const user = this.currentUser();
    this.profileForm = this.fb.group({
      nom: [{ value: user?.nom || '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      prenom: [{ value: user?.prenom || '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      email: [{ value: user?.email || '', disabled: true }, [Validators.required, Validators.email]],
      role: [{ value: user?.role || '', disabled: true }]
    });
  }

  toggleEditMode(): void {
    this.isEditMode.update(mode => !mode);
    
    if (this.isEditMode()) {
      this.profileForm.get('nom')?.enable();
      this.profileForm.get('prenom')?.enable();
      this.profileForm.get('email')?.enable();
    } else {
      const user = this.currentUser();
      this.profileForm.patchValue({
        nom: user?.nom,
        prenom: user?.prenom,
        email: user?.email
      });
      this.profileForm.get('nom')?.disable();
      this.profileForm.get('prenom')?.disable();
      this.profileForm.get('email')?.disable();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.isEditMode()) {
      this.isLoading.set(true);
      
      // Simuler une mise à jour (à implémenter côté backend)
      setTimeout(() => {
        this.notificationService.success('Profil mis à jour avec succès');
        this.isLoading.set(false);
        this.isEditMode.set(false);
        this.profileForm.disable();
      }, 1000);
    }
  }

  getInitials(): string {
    return this.initials();
  }

  getRoleBadgeColor(): string {
    return this.roleBadgeColor();
  }
}
