import { CanalContact } from '../models/canal-contact.enum';
import { EnumConfigFactory, EnumConfig, TailwindColor } from './enum-config.utils';

/**
 * Configuration des labels pour les canaux de contact
 */
const CANAL_CONTACT_LABELS: Record<CanalContact, string> = {
  [CanalContact.EMAIL]: 'Email',
  [CanalContact.LINKEDIN]: 'LinkedIn',
  [CanalContact.TELEPHONE]: 'Téléphone',
  [CanalContact.SITE]: 'Site Web'
} as const;

/**
 * Configuration des icônes FontAwesome pour les canaux de contact
 */
const CANAL_CONTACT_ICONS: Record<CanalContact, string> = {
  [CanalContact.EMAIL]: 'fas fa-envelope',
  [CanalContact.LINKEDIN]: 'fab fa-linkedin',
  [CanalContact.TELEPHONE]: 'fas fa-phone',
  [CanalContact.SITE]: 'fas fa-globe'
} as const;

/**
 * Configuration des couleurs Tailwind pour les canaux de contact
 */
const CANAL_CONTACT_COLORS: Record<CanalContact, TailwindColor> = {
  [CanalContact.EMAIL]: 'blue',
  [CanalContact.LINKEDIN]: 'indigo',
  [CanalContact.TELEPHONE]: 'green',
  [CanalContact.SITE]: 'purple'
} as const;

/**
 * Factory pour la gestion des configurations de canal de contact
 */
const canalContactFactory = new EnumConfigFactory<CanalContact>(
  CANAL_CONTACT_LABELS,
  CANAL_CONTACT_COLORS,
  CANAL_CONTACT_ICONS
);


/**
 * Récupère le label d'un canal de contact
 * @param canal - Le canal de contact
 * @returns Le label correspondant
 */
export const getCanalContactLabel = (canal: CanalContact): string => {
  return canalContactFactory.getLabel(canal);
};

/**
 * Récupère l'icône FontAwesome d'un canal de contact
 * @param canal - Le canal de contact
 * @returns La classe CSS de l'icône
 */
export const getCanalContactIcon = (canal: CanalContact): string => {
  return canalContactFactory.getIcon(canal) || 'fas fa-comment';
};

/**
 * Récupère la couleur Tailwind d'un canal de contact
 * @param canal - Le canal de contact
 * @returns La couleur Tailwind
 */
export const getCanalContactColor = (canal: CanalContact): string => {
  return canalContactFactory.getColor(canal) || 'gray';
};

/**
 * Récupère la configuration complète d'un canal de contact
 * @param canal - Le canal de contact
 * @returns La configuration complète
 */
export const getCanalContactConfig = (canal: CanalContact): EnumConfig<CanalContact> => {
  return canalContactFactory.getConfig(canal);
};

/**
 * Récupère tous les canaux de contact disponibles
 * @returns Tableau de tous les canaux de contact
 */
export const getAllCanauxContact = (): CanalContact[] => {
  return canalContactFactory.getAllValues(CanalContact);
};

/**
 * Récupère les options de canaux de contact pour un select
 * @returns Tableau d'options {value, label}
 */
export const getCanalContactOptions = (): { value: CanalContact; label: string }[] => {
  return canalContactFactory.getOptions(CanalContact);
};
