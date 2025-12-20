/**
 * Configuration des couleurs pour chaque statut de candidature
 */
export const STATUS_COLORS: Record<string, string> = {
    'APPLIQUEE': '#8b5cf6',
    'ENTRETIEN_TELEPHONIQUE': '#3b82f6',
    'ENTRETIEN_TECHNIQUE': '#06b6d4',
    'ENTRETIEN_RH': '#10b981',
    'OFFRE': '#22c55e',
    'REFUSEE': '#ef4444',
    'SANS_REPONSE': '#64748b'
};

/**
 * Configuration des labels pour chaque statut de candidature
 */
export const STATUS_LABELS: Record<string, string> = {
    'APPLIQUEE': 'Postulée',
    'ENTRETIEN_TELEPHONIQUE': 'Entretien Téléphonique',
    'ENTRETIEN_TECHNIQUE': 'Entretien Technique',
    'ENTRETIEN_RH': 'Entretien RH',
    'OFFRE': 'Offre Reçue',
    'REFUSEE': 'Refusée',
    'SANS_REPONSE': 'Sans Réponse'
};

/**
 * Configuration des icônes FontAwesome pour chaque statut de candidature
 */
export const STATUS_ICONS: Record<string, string> = {
    'APPLIQUEE': 'fa-paper-plane',
    'ENTRETIEN_TELEPHONIQUE': 'fa-phone',
    'ENTRETIEN_TECHNIQUE': 'fa-laptop-code',
    'ENTRETIEN_RH': 'fa-users',
    'OFFRE': 'fa-gift',
    'REFUSEE': 'fa-times-circle',
    'SANS_REPONSE': 'fa-question-circle'
};

/**
 * Configuration de la légende du graphique
 */
export const CHART_LEGEND_DATA = [
    'Postulées',
    'Entretiens Téléphoniques',
    'Entretiens Techniques',
    'Entretiens RH',
    'Offres Reçues',
    'Refusées',
    'Sans Réponse'
];

/**
 * Configuration des séries de données (nom, couleur)
 */
import { StatistiquesParJour } from '@models/index';
export interface SeriesConfig {
    name: string;
    color: string;
    dataKey: keyof Pick<
        StatistiquesParJour,
        'appliquees' | 'entretiensTelephoniques' | 'entretiensTechniques' |
        'entretiensRH' | 'offres' | 'refusees' | 'sansReponse'
    >;
}

export const SERIES_CONFIG: SeriesConfig[] = [
    { name: 'Postulées', color: '#8b5cf6', dataKey: 'appliquees' },
    { name: 'Entretiens Téléphoniques', color: '#3b82f6', dataKey: 'entretiensTelephoniques' },
    { name: 'Entretiens Techniques', color: '#06b6d4', dataKey: 'entretiensTechniques' },
    { name: 'Entretiens RH', color: '#10b981', dataKey: 'entretiensRH' },
    { name: 'Offres Reçues', color: '#22c55e', dataKey: 'offres' },
    { name: 'Refusées', color: '#ef4444', dataKey: 'refusees' },
    { name: 'Sans Réponse', color: '#64748b', dataKey: 'sansReponse' }
];
