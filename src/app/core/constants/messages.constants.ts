/**
 * Messages de succès détaillés pour les opérations CRUD
 */

/**
 * Interface pour les messages de succès détaillés
 */
export interface DetailedSuccessMessages {
  readonly CANDIDATURE_CREATED: string;
  readonly CANDIDATURE_UPDATED: string;
  readonly CANDIDATURE_DELETED: string;
  readonly CANDIDATURE_DUPLICATED: string;
  readonly LOGIN_SUCCESS: string;
  readonly LOGOUT_SUCCESS: string;
  readonly REGISTRATION_SUCCESS: string;
  readonly PROFILE_UPDATED: string;
  readonly PASSWORD_CHANGED: string;
  readonly SETTINGS_SAVED: string;
  readonly LANGUAGE_CHANGED: string;
  readonly THEME_CHANGED: string;
  readonly NOTIFICATION_TOGGLED: (label: string, enabled: boolean) => string;
  readonly PRIVACY_TOGGLED: (label: string, enabled: boolean) => string;
  readonly DATA_EXPORTED: string;
  readonly DATA_COPIED: string;
}

/**
 * Interface pour les messages d'erreur détaillés
 */
export interface DetailedErrorMessages {
  readonly GENERIC_ERROR: string;
  readonly NETWORK_ERROR: string;
  readonly UNAUTHORIZED: string;
  readonly FORBIDDEN: string;
  readonly NOT_FOUND: string;
  readonly CANDIDATURE_LOAD_ERROR: string;
  readonly CANDIDATURE_CREATE_ERROR: string;
  readonly CANDIDATURE_UPDATE_ERROR: string;
  readonly CANDIDATURE_DELETE_ERROR: string;
  readonly LOGIN_ERROR: string;
  readonly REGISTRATION_ERROR: string;
  readonly TOKEN_EXPIRED: string;
  readonly FORM_INVALID: string;
  readonly REQUIRED_FIELD: string;
  readonly INVALID_EMAIL: string;
  readonly INVALID_PHONE: string;
  readonly INVALID_URL: string;
  readonly INVALID_POSTAL_CODE: string;
  readonly PASSWORD_MISMATCH: string;
  readonly EMAIL_MISMATCH: string;
  readonly WEAK_PASSWORD: string;
  readonly PASSWORD_MIN_LENGTH: (minLength: number) => string;
  readonly PAST_DATE: string;
  readonly FUTURE_DATE: string;
  readonly INVALID_DATE: string;
  readonly FILE_TOO_LARGE: (maxSize: number) => string;
  readonly INVALID_FILE_TYPE: string;
  readonly UPLOAD_ERROR: string;
}

/**
 * Interface pour les options de confirmation
 */
export interface ConfirmationOptions {
  readonly title: string;
  readonly message: string;
  readonly confirmText: string;
  readonly cancelText: string;
  readonly type: 'danger' | 'warning' | 'info';
  readonly icon: string;
}

/**
 * Interface pour les messages de confirmation
 */
export interface ConfirmationMessages {
  readonly DELETE_CANDIDATURE: (entreprise: string) => ConfirmationOptions;
  readonly DELETE_ACCOUNT: ConfirmationOptions;
  readonly EXPORT_DATA: ConfirmationOptions;
  readonly UNSAVED_CHANGES: ConfirmationOptions;
}

/**
 * Interface pour les messages d'information
 */
export interface InfoMessages {
  readonly LOADING: string;
  readonly SAVING: string;
  readonly DELETING: string;
  readonly PROCESSING: string;
  readonly NO_DATA: string;
  readonly NO_RESULTS: string;
  readonly EMPTY_LIST: string;
  readonly SEARCH_PLACEHOLDER: string;
  readonly SELECT_OPTION: string;
}

/**
 * Interface pour les exigences de validation
 */
export interface ValidationRequirements {
  readonly minLength: string;
  readonly uppercase: string;
  readonly lowercase: string;
  readonly number: string;
  readonly specialChar: string;
}

/**
 * Interface pour les exigences d'email
 */
export interface EmailRequirements {
  readonly format: string;
  readonly required: string;
}

/**
 * Interface pour les exigences de téléphone
 */
export interface PhoneRequirements {
  readonly format: string;
  readonly required: string;
}

/**
 * Interface pour les exigences d'URL
 */
export interface UrlRequirements {
  readonly format: string;
  readonly required: string;
}

/**
 * Interface pour les messages de validation
 */
export interface ValidationMessages {
  readonly PASSWORD_REQUIREMENTS: ValidationRequirements;
  readonly EMAIL_REQUIREMENTS: EmailRequirements;
  readonly PHONE_REQUIREMENTS: PhoneRequirements;
  readonly URL_REQUIREMENTS: UrlRequirements;
}

export const DETAILED_SUCCESS_MESSAGES: DetailedSuccessMessages = {
  // Candidatures
  CANDIDATURE_CREATED: 'Candidature créée avec succès',
  CANDIDATURE_UPDATED: 'Candidature mise à jour avec succès',
  CANDIDATURE_DELETED: 'Candidature supprimée avec succès',
  CANDIDATURE_DUPLICATED: 'Candidature dupliquée avec succès',
  
  // Authentification
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  REGISTRATION_SUCCESS: 'Inscription réussie',
  
  // Profil
  PROFILE_UPDATED: 'Profil mis à jour avec succès',
  PASSWORD_CHANGED: 'Mot de passe modifié avec succès',
  
  // Paramètres
  SETTINGS_SAVED: 'Paramètres enregistrés',
  LANGUAGE_CHANGED: 'Langue modifiée avec succès',
  THEME_CHANGED: 'Thème modifié avec succès',
  NOTIFICATION_TOGGLED: (label: string, enabled: boolean) => 
    `${label} ${enabled ? 'activé' : 'désactivé'}`,
  PRIVACY_TOGGLED: (label: string, enabled: boolean) => 
    `${label} ${enabled ? 'activé' : 'désactivé'}`,
  
  // Données
  DATA_EXPORTED: 'Export des données en cours...',
  DATA_COPIED: 'Copié dans le presse-papiers'
} as const;

/**
 * Messages d'erreur détaillés pour les opérations
 */
export const DETAILED_ERROR_MESSAGES: DetailedErrorMessages = {
  // Erreurs génériques
  GENERIC_ERROR: 'Une erreur est survenue',
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  UNAUTHORIZED: 'Accès non autorisé',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
  
  // Candidatures
  CANDIDATURE_LOAD_ERROR: 'Erreur lors du chargement des candidatures',
  CANDIDATURE_CREATE_ERROR: 'Erreur lors de la création de la candidature',
  CANDIDATURE_UPDATE_ERROR: 'Erreur lors de la mise à jour de la candidature',
  CANDIDATURE_DELETE_ERROR: 'Erreur lors de la suppression de la candidature',
  
  // Authentification
  LOGIN_ERROR: 'Identifiants incorrects',
  REGISTRATION_ERROR: 'Erreur lors de l\'inscription',
  TOKEN_EXPIRED: 'Session expirée, veuillez vous reconnecter',
  
  // Formulaires
  FORM_INVALID: 'Veuillez vérifier les champs du formulaire',
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Email invalide',
  INVALID_PHONE: 'Numéro de téléphone invalide',
  INVALID_URL: 'URL invalide',
  INVALID_POSTAL_CODE: 'Code postal invalide',
  PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas',
  EMAIL_MISMATCH: 'Les emails ne correspondent pas',
  WEAK_PASSWORD: 'Le mot de passe est trop faible',
  PASSWORD_MIN_LENGTH: (minLength: number) => 
    `Le mot de passe doit contenir au moins ${minLength} caractères`,
  
  // Dates
  PAST_DATE: 'La date ne peut pas être dans le passé',
  FUTURE_DATE: 'La date ne peut pas être dans le futur',
  INVALID_DATE: 'Date invalide',
  
  // Fichiers
  FILE_TOO_LARGE: (maxSize: number) => 
    `Le fichier est trop volumineux (max: ${maxSize}MB)`,
  INVALID_FILE_TYPE: 'Type de fichier non supporté',
  UPLOAD_ERROR: 'Erreur lors de l\'upload du fichier'
} as const;

/**
 * Messages de confirmation pour les actions sensibles
 */
export const CONFIRMATION_MESSAGES: ConfirmationMessages = {
  // Candidatures
  DELETE_CANDIDATURE: (entreprise: string) => ({
    title: 'Confirmer la suppression',
    message: `Êtes-vous sûr de vouloir supprimer la candidature pour "${entreprise}" ?`,
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    type: 'danger' as const,
    icon: 'fa-trash'
  }),
  
  // Compte
  DELETE_ACCOUNT: {
    title: 'Supprimer le compte',
    message: 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
    confirmText: 'Supprimer définitivement',
    cancelText: 'Annuler',
    type: 'danger' as const,
    icon: 'fa-exclamation-triangle'
  },
  
  // Données
  EXPORT_DATA: {
    title: 'Exporter les données',
    message: 'Voulez-vous exporter toutes vos données ?',
    confirmText: 'Exporter',
    cancelText: 'Annuler',
    type: 'info' as const,
    icon: 'fa-download'
  },
  
  // Modifications non sauvegardées
  UNSAVED_CHANGES: {
    title: 'Modifications non sauvegardées',
    message: 'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?',
    confirmText: 'Quitter sans sauvegarder',
    cancelText: 'Rester',
    type: 'warning' as const,
    icon: 'fa-exclamation-triangle'
  }
} as const;

/**
 * Messages d'information pour l'utilisateur
 */
export const INFO_MESSAGES: InfoMessages = {
  LOADING: 'Chargement en cours...',
  SAVING: 'Enregistrement en cours...',
  DELETING: 'Suppression en cours...',
  PROCESSING: 'Traitement en cours...',
  NO_DATA: 'Aucune donnée disponible',
  NO_RESULTS: 'Aucun résultat trouvé',
  EMPTY_LIST: 'La liste est vide',
  SEARCH_PLACEHOLDER: 'Rechercher...',
  SELECT_OPTION: 'Sélectionnez une option'
} as const;

/**
 * Messages de validation pour les formulaires
 */
export const VALIDATION_MESSAGES: ValidationMessages = {
  PASSWORD_REQUIREMENTS: {
    minLength: 'Au moins 8 caractères',
    uppercase: 'Au moins une majuscule',
    lowercase: 'Au moins une minuscule',
    number: 'Au moins un chiffre',
    specialChar: 'Au moins un caractère spécial (!@#$%^&*...)'
  },
  
  EMAIL_REQUIREMENTS: {
    format: 'Format: exemple@domaine.com',
    required: 'L\'email est requis'
  },
  
  PHONE_REQUIREMENTS: {
    format: 'Format: 01 23 45 67 89',
    required: 'Le téléphone est requis'
  },
  
  URL_REQUIREMENTS: {
    format: 'Format: https://exemple.com',
    required: 'L\'URL est requise'
  }
} as const;
