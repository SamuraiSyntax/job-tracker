import { TypeRemuneration } from '../models/type-remuneration.enum';
import { EnumConfigFactory, EnumConfig } from './enum-config.utils';

/**
 * Configuration des labels pour les types de rémunération
 */
const TYPE_REMUNERATION_LABELS: Record<TypeRemuneration, string> = {
  [TypeRemuneration.ANNUEL]: 'Annuel',
  [TypeRemuneration.MENSUEL]: 'Mensuel',
  [TypeRemuneration.HORAIRE]: 'Horaire'
} as const;

/**
 * Configuration des icônes FontAwesome pour les types de rémunération
 */
const TYPE_REMUNERATION_ICONS: Record<TypeRemuneration, string> = {
  [TypeRemuneration.ANNUEL]: 'fa-calendar',
  [TypeRemuneration.MENSUEL]: 'fa-calendar-days',
  [TypeRemuneration.HORAIRE]: 'fa-clock'
} as const;

/**
 * Configuration des suffixes pour les types de rémunération
 */
const TYPE_REMUNERATION_SUFFIXES: Record<TypeRemuneration, string> = {
  [TypeRemuneration.ANNUEL]: '/an',
  [TypeRemuneration.MENSUEL]: '/mois',
  [TypeRemuneration.HORAIRE]: '/h'
} as const;

/**
 * Factory pour la gestion des configurations de type de rémunération
 */
const typeRemunerationFactory = new EnumConfigFactory<TypeRemuneration>(
  TYPE_REMUNERATION_LABELS,
  undefined,
  TYPE_REMUNERATION_ICONS
);

/**
 * Récupère le label d'un type de rémunération
 * @param type - Le type de rémunération
 * @returns Le label correspondant
 */
export const getTypeRemunerationLabel = (type: TypeRemuneration): string => {
  return typeRemunerationFactory.getLabel(type);
};

/**
 * Récupère l'icône FontAwesome d'un type de rémunération
 * @param type - Le type de rémunération
 * @returns La classe CSS de l'icône
 */
export const getTypeRemunerationIcon = (type: TypeRemuneration): string => {
  return typeRemunerationFactory.getIcon(type) || 'fa-euro-sign';
};

/**
 * Récupère le suffixe d'un type de rémunération (ex: /an, /mois, /h)
 * @param type - Le type de rémunération
 * @returns Le suffixe correspondant
 */
export const getTypeRemunerationSuffix = (type: TypeRemuneration): string => {
  return TYPE_REMUNERATION_SUFFIXES[type] || '';
};

/**
 * Interface pour la configuration d'un type de rémunération
 */
export interface TypeRemunerationConfig extends EnumConfig<TypeRemuneration> {
  suffix: string;
}

/**
 * Récupère la configuration complète d'un type de rémunération
 * @param type - Le type de rémunération
 * @returns La configuration complète
 */
export const getTypeRemunerationConfig = (type: TypeRemuneration): TypeRemunerationConfig => {
  return {
    ...typeRemunerationFactory.getConfig(type),
    suffix: getTypeRemunerationSuffix(type)
  };
};

/**
 * Récupère tous les types de rémunération disponibles
 * @returns Tableau de tous les types de rémunération
 */
export const getAllTypesRemuneration = (): TypeRemuneration[] => {
  return typeRemunerationFactory.getAllValues(TypeRemuneration);
};

/**
 * Récupère les options de types de rémunération pour un select
 * @returns Tableau d'options {value, label}
 */
export const getTypeRemunerationOptions = (): { value: TypeRemuneration; label: string }[] => {
  return typeRemunerationFactory.getOptions(TypeRemuneration);
};

