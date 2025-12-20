import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'stats',
    loadComponent: () => import('./components/candidatures/candidature-stats/candidature-stats.component').then(m => m.CandidatureStatsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'candidatures',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/candidatures/candidature-list/candidature-list.component').then(m => m.CandidatureListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./components/candidatures/candidature-form/candidature-form.component').then(m => m.CandidatureFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/candidatures/candidature-detail/candidature-detail.component').then(m => m.CandidatureDetailComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./components/candidatures/candidature-form/candidature-form.component').then(m => m.CandidatureFormComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
