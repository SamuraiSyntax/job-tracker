import { Priorite } from '@models/index';
import { EnumConfigFactory, EnumConfig, TailwindColor } from './enum-config.utils';

/**
 * Configuration des labels pour les priorités
 */
const PRIORITE_LABELS: Record<Priorite, string> = {
  [Priorite.BASSE]: 'Basse',
  [Priorite.MOYENNE]: 'Moyenne',
  [Priorite.HAUTE]: 'Haute'
} as const;

/**
 * Configuration des couleurs Tailwind pour les priorités
 */
const PRIORITE_COLORS: Record<Priorite, TailwindColor> = {
  [Priorite.BASSE]: 'gray',
  [Priorite.MOYENNE]: 'yellow',
  [Priorite.HAUTE]: 'red'
} as const;

/**
 * Configuration des icônes FontAwesome pour les priorités
 */
const PRIORITE_ICONS: Record<Priorite, string> = {
  [Priorite.BASSE]: 'fas fa-arrow-down',
  [Priorite.MOYENNE]: 'fas fa-equals',
  [Priorite.HAUTE]: 'fas fa-arrow-up'
} as const;

/**
 * Factory pour la gestion des configurations de priorité
 */
const prioriteFactory = new EnumConfigFactory<Priorite>(
  PRIORITE_LABELS,
  PRIORITE_COLORS,
  PRIORITE_ICONS
);


/**
 * Récupère le label d'une priorité
 * @param priorite - La priorité
 * @returns Le label correspondant
 */
export const getPrioriteLabel = (priorite: Priorite): string => {
  return prioriteFactory.getLabel(priorite);
};

/**
 * Récupère la couleur Tailwind d'une priorité
 * @param priorite - La priorité
 * @returns La couleur Tailwind
 */
export const getPrioriteColor = (priorite: Priorite): string => {
  return prioriteFactory.getColor(priorite) || 'gray';
};

/**
 * Récupère l'icône FontAwesome d'une priorité
 * @param priorite - La priorité
 * @returns La classe CSS de l'icône
 */
export const getPrioriteIcon = (priorite: Priorite): string => {
  return prioriteFactory.getIcon(priorite) || 'fas fa-flag';
};

/**
 * Récupère la configuration complète d'une priorité
 * @param priorite - La priorité
 * @returns La configuration complète
 */
export const getPrioriteConfig = (priorite: Priorite): EnumConfig<Priorite> => {
  return prioriteFactory.getConfig(priorite);
};

/**
 * Récupère toutes les priorités disponibles
 * @returns Tableau de toutes les priorités
 */
export const getAllPriorites = (): Priorite[] => {
  return prioriteFactory.getAllValues(Priorite);
};

/**
 * Récupère les options de priorités pour un select
 * @returns Tableau d'options {value, label}
 */
export const getPrioriteOptions = (): { value: Priorite; label: string }[] => {
  return prioriteFactory.getOptions(Priorite);
};

export function getPrioriteBadgeClass(priorite: Priorite): string {
  const classes: Record<Priorite, string> = {
    [Priorite.BASSE]: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 shadow-sm',
    [Priorite.MOYENNE]: 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 shadow-sm',
    [Priorite.HAUTE]: 'bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-800/50 text-orange-900 dark:text-orange-100 border border-orange-400 dark:border-orange-700 shadow-sm font-bold'
  };
  return classes[priorite] || '';
}