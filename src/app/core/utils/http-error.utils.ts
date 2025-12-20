import { HttpErrorResponse } from '@angular/common/http';

/**
 * Utilitaires pour la gestion centralisée des erreurs HTTP
 */

/**
 * Interface pour les messages d'erreur par code de statut
 */
export type HttpErrorMessages = Record<number, string>;

/**
 * Messages d'erreur HTTP par défaut
 */
const DEFAULT_ERROR_MESSAGES: HttpErrorMessages = {
  400: 'Requête invalide. Veuillez vérifier les données saisies.',
  401: 'Non autorisé. Veuillez vous connecter.',
  403: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.',
  404: 'Ressource non trouvée.',
  409: 'Conflit. Cette ressource existe déjà.',
  422: 'Données invalides. Veuillez vérifier votre saisie.',
  500: 'Erreur serveur. Veuillez réessayer plus tard.',
  502: 'Service temporairement indisponible.',
  503: 'Service en maintenance.',
  0: 'Impossible de joindre le serveur. Vérifiez votre connexion.'
};

/**
 * Génère un message d'erreur lisible à partir d'une HttpErrorResponse
 * 
 * @param error - L'erreur HTTP
 * @param customMessages - Messages personnalisés par code de statut (optionnel)
 * @param defaultMessage - Message par défaut si aucun message spécifique n'est trouvé
 * @returns Message d'erreur formaté
 * 
 * @example
 * ```typescript
 * this.service.getData().subscribe({
 *   error: (error) => {
 *     const message = getHttpErrorMessage(error, {
 *       404: 'Candidature non trouvée'
 *     });
 *     this.notificationService.error(message);
 *   }
 * });
 * ```
 */
export function getHttpErrorMessage(
  error: HttpErrorResponse,
  customMessages?: HttpErrorMessages,
  defaultMessage = 'Une erreur est survenue. Veuillez réessayer.'
): string {
  // Si l'erreur contient un message du serveur, l'utiliser en priorité
  if (error.error?.message) {
    return error.error.message;
  }

  // Utiliser le message personnalisé si disponible
  if (customMessages && customMessages[error.status]) {
    return customMessages[error.status];
  }

  // Utiliser le message par défaut pour ce code de statut
  if (DEFAULT_ERROR_MESSAGES[error.status]) {
    return DEFAULT_ERROR_MESSAGES[error.status];
  }

  // Message par défaut
  return defaultMessage;
}

/**
 * Gère une erreur HTTP et retourne un objet avec le message et des métadonnées
 * 
 * @param error - L'erreur HTTP
 * @param context - Contexte de l'erreur (nom de l'opération)
 * @param customMessages - Messages personnalisés par code de statut (optionnel)
 * @returns Objet contenant le message d'erreur et des métadonnées
 * 
 * @example
 * ```typescript
 * this.service.createData(data).subscribe({
 *   error: (error) => {
 *     const errorInfo = handleHttpError(error, 'création de la candidature');
 *     console.error(errorInfo.details);
 *     this.notificationService.error(errorInfo.message);
 *   }
 * });
 * ```
 */
export function handleHttpError(
  error: HttpErrorResponse,
  context?: string,
  customMessages?: HttpErrorMessages
): {
  message: string;
  status: number;
  details: string;
  timestamp: Date;
} {
  const message = getHttpErrorMessage(error, customMessages);
  const contextMessage = context ? `Erreur lors de ${context}` : message;

  return {
    message: contextMessage,
    status: error.status,
    details: error.message || message,
    timestamp: new Date()
  };
}

/**
 * Messages d'erreur spécifiques pour les opérations CRUD de candidatures
 */
export const CANDIDATURE_ERROR_MESSAGES: HttpErrorMessages = {
  401: 'Cette candidature ne vous appartient pas ou votre session a expiré.',
  404: 'Candidature non trouvée.',
  403: 'Accès refusé à cette candidature.',
  409: 'Une candidature similaire existe déjà.',
};

/**
 * Messages d'erreur spécifiques pour l'authentification
 */
export const AUTH_ERROR_MESSAGES: HttpErrorMessages = {
  400: 'Email ou mot de passe incorrect.',
  401: 'Identifiants invalides.',
  409: 'Cet email est déjà utilisé.',
  422: 'Données d\'inscription invalides.',
};

/**
 * Messages d'erreur spécifiques pour les statistiques
 */
export const STATS_ERROR_MESSAGES: HttpErrorMessages = {
  404: 'Aucune statistique disponible.',
  500: 'Impossible de charger les statistiques.',
};

/**
 * Vérifie si une erreur est une erreur d'authentification
 */
export function isAuthError(error: HttpErrorResponse): boolean {
  return error.status === 401 || error.status === 403;
}

/**
 * Vérifie si une erreur est une erreur réseau
 */
export function isNetworkError(error: HttpErrorResponse): boolean {
  return error.status === 0 || error.status === 502 || error.status === 503;
}

/**
 * Vérifie si une erreur est une erreur de validation
 */
export function isValidationError(error: HttpErrorResponse): boolean {
  return error.status === 400 || error.status === 422;
}
