import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe pour tronquer du texte à une longueur maximale.
 * 
 * @example
 * ```html
 * <p>{{ description | truncate:100 }}</p>
 * <p>{{ title | truncate:50:'…' }}</p>
 * ```
 * 
 * @example
 * ```typescript
 * // Input: value = "Lorem ipsum dolor sit amet", limit = 10
 * // Output: "Lorem ipsu..."
 * ```
 */
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  /**
   * Tronque une chaîne de caractères à une longueur maximale.
   * 
   * @param value - Le texte à tronquer
   * @param limit - La longueur maximale (par défaut: 50)
   * @param ellipsis - Le caractère ou la chaîne à ajouter à la fin (par défaut: '...')
   * @returns Le texte tronqué avec l'ellipse, ou le texte original si plus court que la limite
   */
  transform(value: string | null | undefined, limit = 50, ellipsis = '...'): string {
    if (!value) return '';
    
    if (value.length <= limit) return value;
    
    return value.substring(0, limit).trim() + ellipsis;
  }
}
