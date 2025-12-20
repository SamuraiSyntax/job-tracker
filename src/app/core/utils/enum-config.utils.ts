/**
 * Utilitaire générique pour gérer les configurations d'énumérations
 * Réduit la duplication de code entre les différents utils (statut, priorité, etc.)
 */

/**
 * Configuration complète pour un élément d'énumération
 */
export interface EnumConfig<T = string> {
  label: string;
  color?: string;
  icon?: string;
  value?: T;
}

/**
 * Factory générique pour créer des fonctions de configuration d'énumération
 */
export class EnumConfigFactory<T extends string | number> {
  constructor(
    private readonly labels: Record<T, string>,
    private readonly colors?: Record<T, string>,
    private readonly icons?: Record<T, string>
  ) {}

  /**
   * Obtient le label d'une valeur d'énumération
   */
  getLabel = (value: T): string => {
    return this.labels[value] || String(value);
  };

  /**
   * Obtient la couleur d'une valeur d'énumération
   */
  getColor = (value: T): string | undefined => {
    return this.colors?.[value];
  };

  /**
   * Obtient l'icône d'une valeur d'énumération
   */
  getIcon = (value: T): string | undefined => {
    return this.icons?.[value];
  };

  /**
   * Obtient la configuration complète d'une valeur d'énumération
   */
  getConfig = (value: T): EnumConfig<T> => {
    return {
      value,
      label: this.getLabel(value),
      ...(this.colors && { color: this.getColor(value) }),
      ...(this.icons && { icon: this.getIcon(value) })
    };
  };

  /**
   * Obtient toutes les valeurs d'énumération
   */
  getAllValues = (enumObj: Record<string, T>): T[] => {
    return Object.values(enumObj);
  };

  /**
   * Obtient les options pour un select
   */
  getOptions = (enumObj: Record<string, T>): { value: T; label: string }[] => {
    return this.getAllValues(enumObj).map(value => ({
      value,
      label: this.getLabel(value)
    }));
  };
}

/**
 * Type helper pour les configurations de couleurs Tailwind
 */
export type TailwindColor = 
  | 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'
  | 'orange' | 'teal' | 'cyan' | 'lime' | 'emerald' | 'sky' | 'violet' | 'fuchsia' | 'rose';
