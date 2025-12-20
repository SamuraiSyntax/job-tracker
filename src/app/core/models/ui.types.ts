/**
 * Définition d'une colonne de tableau
 */
export interface ColumnDefinition {
  key: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
  icon?: string;
}

/**
 * Direction de tri
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Élément de menu
 */
export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  href?: string;
  target?: string;
  badge?: number;
  description?: string;
  exact?: boolean;
}

/**
 * Paramètre de notification utilisateur
 */
export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: string;
}

/**
 * Paramètre de confidentialité
 */
export interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: string;
}

/**
 * Configuration d'un statut pour l'affichage
 */
export interface StatusConfig {
  label: string;
  color: string;
  icon?: string;
}
