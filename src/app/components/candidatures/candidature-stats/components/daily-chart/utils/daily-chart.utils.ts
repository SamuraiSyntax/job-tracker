import { StatistiquesParJour } from '@models/index';

/**
 * Formate un label de jour pour l'affichage (Auj., Hier, JJ/MM)
 */
export function formatDayLabel(jour: string): string {
    const date = new Date(jour);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Réinitialiser les heures pour comparer uniquement les dates
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
        return "Auj.";
    } else if (date.getTime() === yesterday.getTime()) {
        return "Hier";
    } else {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    }
}

/**
 * Extrait les données pour une série donnée
 */
export function extractSeriesData(
    dailyStats: StatistiquesParJour[],
    dataKey: keyof StatistiquesParJour
): number[] {
    return dailyStats.map(stat => stat[dataKey] as number);
}
