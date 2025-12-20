import { TypeContrat } from '../models/type-contrat.enum';
import { EnumConfigFactory, EnumConfig, TailwindColor } from './enum-config.utils';

/**
 * Configuration des labels pour les types de contrat
 */
const TYPE_CONTRAT_LABELS: Record<TypeContrat, string> = {
  [TypeContrat.CDI]: 'CDI',
  [TypeContrat.CDD]: 'CDD',
  [TypeContrat.FREELANCE]: 'Freelance',
  [TypeContrat.STAGE]: 'Stage',
  [TypeContrat.ALTERNANCE]: 'Alternance',
  [TypeContrat.INTERIM]: 'Intérim'
} as const;

/**
 * Configuration des icônes FontAwesome pour les types de contrat
 */
const TYPE_CONTRAT_ICONS: Record<TypeContrat, string> = {
  [TypeContrat.CDI]: 'fas fa-briefcase',
  [TypeContrat.CDD]: 'fas fa-calendar-alt',
  [TypeContrat.FREELANCE]: 'fas fa-user-tie',
  [TypeContrat.STAGE]: 'fas fa-graduation-cap',
  [TypeContrat.ALTERNANCE]: 'fas fa-exchange-alt',
  [TypeContrat.INTERIM]: 'fas fa-clock'
} as const;

/**
 * Configuration des couleurs Tailwind pour les types de contrat
 */
const TYPE_CONTRAT_COLORS: Record<TypeContrat, TailwindColor> = {
  [TypeContrat.CDI]: 'green',
  [TypeContrat.CDD]: 'blue',
  [TypeContrat.FREELANCE]: 'purple',
  [TypeContrat.STAGE]: 'yellow',
  [TypeContrat.ALTERNANCE]: 'indigo',
  [TypeContrat.INTERIM]: 'orange'
} as const;

/**
 * Factory pour la gestion des configurations de type de contrat
 */
const typeContratFactory = new EnumConfigFactory<TypeContrat>(
  TYPE_CONTRAT_LABELS,
  TYPE_CONTRAT_COLORS,
  TYPE_CONTRAT_ICONS
);


/**
 * Récupère le label d'un type de contrat
 * @param type - Le type de contrat
 * @returns Le label correspondant
 */
export const getTypeContratLabel = (type: TypeContrat): string => {
  return typeContratFactory.getLabel(type);
};

/**
 * Récupère l'icône FontAwesome d'un type de contrat
 * @param type - Le type de contrat
 * @returns La classe CSS de l'icône
 */
export const getTypeContratIcon = (type: TypeContrat): string => {
  return typeContratFactory.getIcon(type) || 'fas fa-file-contract';
};

/**
 * Récupère la couleur Tailwind d'un type de contrat
 * @param type - Le type de contrat
 * @returns La couleur Tailwind
 */
export const getTypeContratColor = (type: TypeContrat): string => {
  return typeContratFactory.getColor(type) || 'gray';
};

/**
 * Récupère la configuration complète d'un type de contrat
 * @param type - Le type de contrat
 * @returns La configuration complète
 */
export const getTypeContratConfig = (type: TypeContrat): EnumConfig<TypeContrat> => {
  return typeContratFactory.getConfig(type);
};

/**
 * Récupère tous les types de contrat disponibles
 * @returns Tableau de tous les types de contrat
 */
export const getAllTypesContrat = (): TypeContrat[] => {
  return typeContratFactory.getAllValues(TypeContrat);
};

/**
 * Récupère les options de types de contrat pour un select
 * @returns Tableau d'options {value, label}
 */
export const getTypeContratOptions = (): { value: TypeContrat; label: string }[] => {
  return typeContratFactory.getOptions(TypeContrat);
};

export function getTypeContratBadgeClass(type: TypeContrat): string {
  const classes: Record<TypeContrat, string> = {
    [TypeContrat.CDI]: 'bg-gradient-to-r from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-700 shadow-sm font-bold',
    [TypeContrat.CDD]: 'bg-gradient-to-r from-blue-100 to-cyan-200 dark:from-blue-900/50 dark:to-cyan-800/50 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 shadow-sm',
    [TypeContrat.INTERIM]: 'bg-gradient-to-r from-purple-100 to-fuchsia-200 dark:from-purple-900/50 dark:to-fuchsia-800/50 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-700 shadow-sm',
    [TypeContrat.STAGE]: 'bg-gradient-to-r from-orange-100 to-amber-200 dark:from-orange-900/50 dark:to-amber-800/50 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-700 shadow-sm',
    [TypeContrat.ALTERNANCE]: 'bg-gradient-to-r from-indigo-100 to-violet-200 dark:from-indigo-900/50 dark:to-violet-800/50 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700 shadow-sm',
    [TypeContrat.FREELANCE]: 'bg-gradient-to-r from-yellow-100 to-lime-200 dark:from-yellow-900/50 dark:to-lime-800/50 text-yellow-900 dark:text-yellow-100 border border-yellow-400 dark:border-yellow-700 shadow-sm'
  };
  return classes[type] || '';
}