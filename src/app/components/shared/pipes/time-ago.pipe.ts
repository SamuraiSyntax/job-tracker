import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe pour afficher une date au format "Il y a X temps".
 * 
 * @example
 * ```html
 * <p>{{ candidature.dateCandidature | timeAgo }}</p>
 * ```
 * 
 * @example
 * ```typescript
 * // Input: new Date() - 2 heures
 * // Output: "Il y a 2 heures"
 * // Input: new Date() - 3 jours
 * // Output: "Il y a 3 jours"
 * ```
 */
@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  /**
   * Convertit une date en texte relatif indiquant le temps écoulé.
   * 
   * @param value - La date à convertir (Date, string ISO, ou null/undefined)
   * @returns Le texte formaté (ex: "Il y a 2 heures", "À l'instant"), ou chaîne vide si valeur nulle
   */
  transform(value: Date | string | null | undefined): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'À l\'instant';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `Il y a ${months} mois`;
    
    const years = Math.floor(days / 365);
    return `Il y a ${years} an${years > 1 ? 's' : ''}`;
  }
}
