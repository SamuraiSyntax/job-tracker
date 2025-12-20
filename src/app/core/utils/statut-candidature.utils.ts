import { StatutCandidature } from '@models/statut-candidature.enum';
import { EnumConfigFactory, EnumConfig } from './enum-config.utils';

/**
 * Configuration des labels pour les statuts de candidature
 */
const STATUT_LABELS: Record<StatutCandidature, string> = {
  [StatutCandidature.APPLIQUEE]: 'Postulée',
  [StatutCandidature.ENTRETIEN_TELEPHONIQUE]: 'Entretien Téléphonique',
  [StatutCandidature.ENTRETIEN_TECHNIQUE]: 'Entretien Technique',
  [StatutCandidature.ENTRETIEN_RH]: 'Entretien RH',
  [StatutCandidature.OFFRE]: 'Offre Reçue',
  [StatutCandidature.REFUSEE]: 'Refusée',
  [StatutCandidature.SANS_REPONSE]: 'Sans Réponse'
} as const;

/**
 * Configuration des couleurs hexadécimales pour les statuts de candidature
 */
const STATUT_COLORS: Record<StatutCandidature, string> = {
  [StatutCandidature.APPLIQUEE]: '#8b5cf6',
  [StatutCandidature.ENTRETIEN_TELEPHONIQUE]: '#3b82f6',
  [StatutCandidature.ENTRETIEN_TECHNIQUE]: '#06b6d4',
  [StatutCandidature.ENTRETIEN_RH]: '#10b981',
  [StatutCandidature.OFFRE]: '#22c55e',
  [StatutCandidature.REFUSEE]: '#ef4444',
  [StatutCandidature.SANS_REPONSE]: '#64748b'
} as const;

/**
 * Configuration des icônes FontAwesome pour les statuts de candidature
 */
const STATUT_ICONS: Record<StatutCandidature, string> = {
  [StatutCandidature.APPLIQUEE]: 'fa-paper-plane',
  [StatutCandidature.ENTRETIEN_TELEPHONIQUE]: 'fa-phone',
  [StatutCandidature.ENTRETIEN_TECHNIQUE]: 'fa-laptop-code',
  [StatutCandidature.ENTRETIEN_RH]: 'fa-users',
  [StatutCandidature.OFFRE]: 'fa-gift',
  [StatutCandidature.REFUSEE]: 'fa-times-circle',
  [StatutCandidature.SANS_REPONSE]: 'fa-question-circle'
} as const;

/**
 * Factory pour la gestion des configurations de statut de candidature
 */
const statutFactory = new EnumConfigFactory<StatutCandidature>(
  STATUT_LABELS,
  STATUT_COLORS,
  STATUT_ICONS
);


/**
 * Obtient le label français d'un statut de candidature
 * @param statut - Le statut de candidature
 * @returns Le label correspondant
 */
export const getStatutLabel = (statut: StatutCandidature): string => {
  return statutFactory.getLabel(statut);
};

/**
 * Obtient la couleur hexadécimale associée à un statut de candidature
 * @param statut - Le statut de candidature
 * @returns La couleur en format hexadécimal
 */
export const getStatutColor = (statut: StatutCandidature): string => {
  return statutFactory.getColor(statut) || '#64748b';
};

/**
 * Obtient l'icône FontAwesome associée à un statut de candidature
 * @param statut - Le statut de candidature
 * @returns La classe CSS de l'icône FontAwesome
 */
export const getStatutIcon = (statut: StatutCandidature): string => {
  return statutFactory.getIcon(statut) || 'fa-question-circle';
};

/**
 * Obtient la configuration complète d'un statut de candidature
 * @param statut - Le statut de candidature
 * @returns La configuration complète (label, couleur, icône)
 */
export const getStatutConfig = (statut: StatutCandidature): EnumConfig<StatutCandidature> => {
  return statutFactory.getConfig(statut);
};

/**
 * Obtient tous les statuts de candidature disponibles
 * @returns Un tableau de tous les statuts
 */
export const getAllStatuts = (): StatutCandidature[] => {
  return statutFactory.getAllValues(StatutCandidature);
};

/**
 * Obtient tous les statuts avec leurs labels
 * @returns Un tableau d'objets {value, label}
 */
export const getStatutOptions = (): { value: StatutCandidature; label: string }[] => {
  return statutFactory.getOptions(StatutCandidature);
};

export function getStatutBadgeClass(statut: StatutCandidature): string {
  const classes: Record<StatutCandidature, string> = {
    [StatutCandidature.APPLIQUEE]: 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 shadow-sm',
    [StatutCandidature.ENTRETIEN_TELEPHONIQUE]: 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-700 shadow-sm',
    [StatutCandidature.ENTRETIEN_TECHNIQUE]: 'bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-700 shadow-sm',
    [StatutCandidature.ENTRETIEN_RH]: 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700 shadow-sm',
    [StatutCandidature.OFFRE]: 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700 shadow-sm',
    [StatutCandidature.REFUSEE]: 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700 shadow-sm',
    [StatutCandidature.SANS_REPONSE]: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 shadow-sm'
  };
  return classes[statut] || '';
}