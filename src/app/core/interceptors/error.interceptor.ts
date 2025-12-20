import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { NotificationService } from '@services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gestion des erreurs d'authentification
      if (error.status === 401) {
        // Token invalide ou expiré - uniquement pour les erreurs d'auth réelles
        // On ne déconnecte PAS si c'est juste un endpoint qui manque (message différent)
        if (!req.url.includes('/stats/') && error.error?.message !== 'Endpoint not found') {
          authService.logout();
          router.navigate(['/auth/login']);
          notificationService.error('Session expirée. Veuillez vous reconnecter.');
        } else {
          // Erreur liée à un endpoint manquant, on n'affiche qu'un warning
          console.warn('[AUTH] Endpoint non disponible:', req.url);
        }
      } else if (error.status === 403) {
        // Accès refusé
        notificationService.error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
        router.navigate(['/dashboard']);
      } else if (error.status === 404) {
        // Ressource non trouvée - on ne déconnecte jamais sur un 404
        console.warn('[HTTP] Ressource non trouvée:', req.url);
      } else if (error.status === 429 || (typeof error.error?.message === 'string' && error.error.message.toLowerCase().includes('trop de tentatives'))) {
        // Blocage anti-bruteforce
        notificationService.error('Compte temporairement bloqué après trop de tentatives. Réessayez dans 15 minutes.');
      } else if (error.status === 500) {
        // Erreur serveur
        notificationService.error('Erreur serveur. Veuillez réessayer plus tard.');
      } else if (error.status === 0) {
        // Erreur réseau
        notificationService.error('Erreur de connexion. Vérifiez votre connexion internet.');
      }

      return throwError(() => error);
    })
  );
};
