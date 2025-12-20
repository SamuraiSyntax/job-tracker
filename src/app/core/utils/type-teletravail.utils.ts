import { TypeTeletravail } from '../models/type-teletravail.enum';
import { EnumConfigFactory, EnumConfig } from './enum-config.utils';

/**
 * Configuration des labels pour les types de télétravail
 */
const TYPE_TELETRAVAIL_LABELS: Record<TypeTeletravail, string> = {
  [TypeTeletravail.COMPLET]: 'Télétravail complet',
  [TypeTeletravail.PARTIEL]: 'Télétravail partiel',
  [TypeTeletravail.AUCUN]: 'Aucun télétravail'
} as const;

/**
 * Configuration des icônes FontAwesome pour les types de télétravail
 */
const TYPE_TELETRAVAIL_ICONS: Record<TypeTeletravail, string> = {
  [TypeTeletravail.COMPLET]: 'fa-home',
  [TypeTeletravail.PARTIEL]: 'fa-calendar-week',
  [TypeTeletravail.AUCUN]: 'fa-building'
} as const;

/**
 * Configuration des classes CSS pour les types de télétravail
 */
const TYPE_TELETRAVAIL_COLORS: Record<TypeTeletravail, string> = {
  [TypeTeletravail.COMPLET]: 'text-green-600 dark:text-green-400',
  [TypeTeletravail.PARTIEL]: 'text-blue-600 dark:text-blue-400',
  [TypeTeletravail.AUCUN]: 'text-gray-600 dark:text-gray-400'
} as const;

/**
 * Factory pour la gestion des configurations de type de télétravail
 */
const typeTeletravailFactory = new EnumConfigFactory<TypeTeletravail>(
  TYPE_TELETRAVAIL_LABELS,
  TYPE_TELETRAVAIL_COLORS,
  TYPE_TELETRAVAIL_ICONS
);

/**
 * Récupère le label d'un type de télétravail
 * @param type - Le type de télétravail
 * @returns Le label correspondant
 */
export const getTypeTeletravailLabel = (type: TypeTeletravail): string => {
  return typeTeletravailFactory.getLabel(type);
};

/**
 * Récupère l'icône FontAwesome d'un type de télétravail
 * @param type - Le type de télétravail
 * @returns La classe CSS de l'icône
 */
export const getTypeTeletravailIcon = (type: TypeTeletravail): string => {
  return typeTeletravailFactory.getIcon(type) || 'fa-laptop-house';
};

/**
 * Récupère les classes CSS Tailwind pour un type de télétravail
 * @param type - Le type de télétravail
 * @returns Les classes CSS Tailwind
 */
export const getTypeTeletravailColor = (type: TypeTeletravail): string => {
  return typeTeletravailFactory.getColor(type) || 'text-gray-600 dark:text-gray-400';
};


/**
 * Récupère la configuration complète d'un type de télétravail
 * @param type - Le type de télétravail
 * @returns La configuration complète
 */
export const getTypeTeletravailConfig = (type: TypeTeletravail): EnumConfig<TypeTeletravail> => {
  return typeTeletravailFactory.getConfig(type);
};

/**
 * Récupère tous les types de télétravail disponibles
 * @returns Tableau de tous les types de télétravail
 */
export const getAllTypesTeletravail = (): TypeTeletravail[] => {
  return typeTeletravailFactory.getAllValues(TypeTeletravail);
};

/**
 * Récupère les options de types de télétravail pour un select
 * @returns Tableau d'options {value, label}
 */
export const getTypeTeletravailOptions = (): { value: TypeTeletravail; label: string }[] => {
  return typeTeletravailFactory.getOptions(TypeTeletravail);
};
