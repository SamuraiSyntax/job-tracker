/**
 * Constantes globales de l'application
 */

/**
 * Interface pour les routes de navigation de l'application
 */
export interface AppRoutes {
  readonly AUTH: {
    readonly LOGIN: string;
    readonly REGISTER: string;
  };
  readonly DASHBOARD: string;
  readonly PROFILE: string;
  readonly SETTINGS: string;
  readonly CANDIDATURES: {
    readonly LIST: string;
    readonly NEW: string;
    readonly DETAIL: (id: number | string) => string;
    readonly EDIT: (id: number | string) => string;
    readonly STATS: string;
  };
  readonly ADMIN: string;
}

/**
 * Interface pour les messages d'erreur standard
 */
export interface ErrorMessages {
  readonly NETWORK: string;
  readonly UNAUTHORIZED: string;
  readonly FORBIDDEN: string;
  readonly NOT_FOUND: string;
  readonly SERVER_ERROR: string;
  readonly VALIDATION: string;
  readonly UNKNOWN: string;
}

/**
 * Interface pour les messages de succès standard
 */
export interface SuccessMessages {
  readonly CANDIDATURE_CREATED: string;
  readonly CANDIDATURE_UPDATED: string;
  readonly CANDIDATURE_DELETED: string;
  readonly LOGIN_SUCCESS: string;
  readonly REGISTER_SUCCESS: string;
  readonly LOGOUT_SUCCESS: string;
}

/**
 * Interface pour la configuration de l'application
 */
export interface ApplicationConfig {
  readonly DEFAULT_PAGE_SIZE: number;
  readonly MAX_PAGE_SIZE: number;
  readonly DEBOUNCE_TIME: number;
  readonly SNACKBAR_DURATION: number;
  readonly ERROR_SNACKBAR_DURATION: number;
  readonly TOKEN_STORAGE_KEY: string;
  readonly USER_STORAGE_KEY: string;
}

/**
 * Interface pour les formats de date
 */
export interface DateFormats {
  readonly SHORT: string;
  readonly MEDIUM: string;
  readonly LONG: string;
  readonly FULL: string;
  readonly TIME: string;
  readonly DATETIME: string;
}

/**
 * Interface pour les patterns de validation regex
 */
export interface ValidationPatterns {
  readonly EMAIL: RegExp;
  readonly PASSWORD: RegExp;
  readonly URL: RegExp;
}

/**
 * Interface pour une limite de validation
 */
export interface ValidationLimit {
  readonly MIN?: number;
  readonly MAX: number;
}

/**
 * Interface pour les limites de validation des champs
 */
export interface ValidationLimits {
  readonly ENTREPRISE: ValidationLimit & { readonly MIN: number };
  readonly POSTE: ValidationLimit & { readonly MIN: number };
  readonly LOCALISATION: ValidationLimit & { readonly MIN: number };
  readonly SOURCE: ValidationLimit;
  readonly NOM: ValidationLimit & { readonly MIN: number };
  readonly PRENOM: ValidationLimit & { readonly MIN: number };
  readonly PASSWORD: ValidationLimit & { readonly MIN: number };
}

// Routes de navigation
export const ROUTES: AppRoutes = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  CANDIDATURES: {
    LIST: '/candidatures',
    NEW: '/candidatures/new',
    DETAIL: (id: number | string) => `/candidatures/${id}`,
    EDIT: (id: number | string) => `/candidatures/${id}/edit`,
    STATS: '/candidatures/stats',
  },
  ADMIN: '/admin',
} as const;

// Messages d'erreur
export const ERROR_MESSAGES: ErrorMessages = {
  NETWORK: 'Erreur de connexion au serveur',
  UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette page',
  FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires',
  NOT_FOUND: 'La ressource demandée n\'existe pas',
  SERVER_ERROR: 'Une erreur serveur est survenue',
  VALIDATION: 'Veuillez vérifier les informations saisies',
  UNKNOWN: 'Une erreur inattendue est survenue',
} as const;

// Messages de succès
export const SUCCESS_MESSAGES: SuccessMessages = {
  CANDIDATURE_CREATED: 'Candidature créée avec succès',
  CANDIDATURE_UPDATED: 'Candidature mise à jour avec succès',
  CANDIDATURE_DELETED: 'Candidature supprimée avec succès',
  LOGIN_SUCCESS: 'Connexion réussie',
  REGISTER_SUCCESS: 'Inscription réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
} as const;

// Configuration de l'application
export const APP_CONFIG: ApplicationConfig = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEBOUNCE_TIME: 300,
  SNACKBAR_DURATION: 3000,
  ERROR_SNACKBAR_DURATION: 5000,
  TOKEN_STORAGE_KEY: 'auth_token',
  USER_STORAGE_KEY: 'current_user',
} as const;

// Formats de date
export const DATE_FORMATS: DateFormats = {
  SHORT: 'dd/MM/yyyy',
  MEDIUM: 'dd MMM yyyy',
  LONG: 'dd MMMM yyyy',
  FULL: 'EEEE dd MMMM yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
} as const;

// Regex patterns
export const PATTERNS: ValidationPatterns = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
} as const;

// Limites de validation
export const VALIDATION_LIMITS: ValidationLimits = {
  ENTREPRISE: { MIN: 2, MAX: 100 },
  POSTE: { MIN: 2, MAX: 100 },
  LOCALISATION: { MIN: 2, MAX: 100 },
  SOURCE: { MAX: 200 },
  NOM: { MIN: 2, MAX: 50 },
  PRENOM: { MIN: 2, MAX: 50 },
  PASSWORD: { MIN: 8, MAX: 100 },
} as const;
