/**
 * Utilitaires pour le formatage et la manipulation des dates
 */

/**
 * Formate une date au format local YYYY-MM-DD
 * Évite les problèmes de timezone en utilisant les valeurs locales
 * @param date - La date à formater (Date ou string)
 * @returns La date formatée au format YYYY-MM-DD
 */
export function formatDateToLocalString(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Formate une date au format français complet (ex: "25 décembre 2023")
 * @param dateStr - La date à formater (string ISO ou Date)
 * @param options - Options de formatage Intl.DateTimeFormat (optionnel)
 * @returns La date formatée en français complet
 * 
 * @example
 * ```typescript
 * formatDateToLongFrench('2023-12-25') // "25 décembre 2023"
 * formatDateToLongFrench('2023-12-25', { day: 'numeric', month: 'short' }) // "25 déc."
 * ```
 */
export function formatDateToLongFrench(
  dateStr: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }
): string {
  if (!dateStr) return '';
  
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString('fr-FR', options);
}

/**
 * Formate une date au format français JJ/MM/AAAA
 * @param date - La date à formater (Date ou string)
 * @returns La date formatée au format JJ/MM/AAAA
 */
export function formatDateToFrench(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${day}/${month}/${year}`;
}

/**
 * Formate une date avec l'heure au format français JJ/MM/AAAA HH:MM
 * @param date - La date à formater (Date ou string)
 * @returns La date et l'heure formatées
 */
export function formatDateTimeToFrench(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Calcule le nombre de jours entre deux dates
 * @param date1 - Première date
 * @param date2 - Deuxième date (par défaut: aujourd'hui)
 * @returns Le nombre de jours de différence
 */
export function daysBetween(date1: Date | string, date2: Date | string = new Date()): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Vérifie si une date est aujourd'hui
 * @param date - La date à vérifier
 * @returns true si la date est aujourd'hui
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
}

/**
 * Vérifie si une date est dans le passé
 * @param date - La date à vérifier
 * @returns true si la date est dans le passé
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
}

/**
 * Vérifie si une date est dans le futur
 * @param date - La date à vérifier
 * @returns true si la date est dans le futur
 */
export function isFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d > new Date();
}

/**
 * Obtient le début de la journée pour une date donnée
 * @param date - La date (par défaut: aujourd'hui)
 * @returns La date au début de la journée (00:00:00)
 */
export function startOfDay(date: Date | string = new Date()): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Obtient la fin de la journée pour une date donnée
 * @param date - La date (par défaut: aujourd'hui)
 * @returns La date à la fin de la journée (23:59:59)
 */
export function endOfDay(date: Date | string = new Date()): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
