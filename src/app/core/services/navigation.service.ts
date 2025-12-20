import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Service de navigation type-safe utilisant les meilleures pratiques Angular 21
 * Centralise toutes les routes de l'application pour éviter les chaînes magiques
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly router = inject(Router);

  /**
   * Routes de l'application avec type-safety
   */
  readonly routes = {
    auth: {
      login: '/auth/login',
      register: '/auth/register'
    },
    dashboard: '/dashboard',
    profile: '/profile',
    settings: '/settings',
    stats: '/stats',
    candidatures: {
      list: '/candidatures',
      new: '/candidatures/new',
      detail: (id: number | string) => `/candidatures/${id}`,
      edit: (id: number | string) => `/candidatures/${id}/edit`
    }
  } as const;

  /**
   * Navigue vers la page de connexion
   */
  toLogin(): Promise<boolean> {
    return this.router.navigate([this.routes.auth.login]);
  }

  /**
   * Navigue vers la page d'inscription
   */
  toRegister(): Promise<boolean> {
    return this.router.navigate([this.routes.auth.register]);
  }

  /**
   * Navigue vers le dashboard
   */
  toDashboard(): Promise<boolean> {
    return this.router.navigate([this.routes.dashboard]);
  }

  /**
   * Navigue vers la page de profil
   */
  toProfile(): Promise<boolean> {
    return this.router.navigate([this.routes.profile]);
  }

  /**
   * Navigue vers la page des paramètres
   */
  toSettings(): Promise<boolean> {
    return this.router.navigate([this.routes.settings]);
  }

  /**
   * Navigue vers la page des statistiques
   */
  toStats(): Promise<boolean> {
    return this.router.navigate([this.routes.stats]);
  }

  /**
   * Navigue vers la liste des candidatures
   */
  toCandidaturesList(): Promise<boolean> {
    return this.router.navigate([this.routes.candidatures.list]);
  }

  /**
   * Navigue vers le formulaire de création de candidature
   */
  toNewCandidature(): Promise<boolean> {
    return this.router.navigate([this.routes.candidatures.new]);
  }

  /**
   * Navigue vers le détail d'une candidature
   * @param id - L'identifiant de la candidature
   */
  toCandidatureDetail(id: number | string): Promise<boolean> {
    return this.router.navigate([this.routes.candidatures.detail(id)]);
  }

  /**
   * Navigue vers l'édition d'une candidature
   * @param id - L'identifiant de la candidature
   */
  toEditCandidature(id: number | string): Promise<boolean> {
    return this.router.navigate([this.routes.candidatures.edit(id)]);
  }

  /**
   * Navigue vers une route avec des query params
   * @param commands - Les segments de route
   * @param queryParams - Les paramètres de query
   */
  navigateWithParams(commands: (string | number)[], queryParams?: Record<string, unknown>): Promise<boolean> {
    return this.router.navigate(commands, { queryParams });
  }

  /**
   * Retourne à la page précédente
   */
  back(): void {
    window.history.back();
  }
}
