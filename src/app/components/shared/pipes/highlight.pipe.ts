import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe pour mettre en surbrillance du texte dans une chaîne de caractères.
 * 
 * @example
 * ```html
 * <p [innerHTML]="description | highlight:searchTerm"></p>
 * ```
 * 
 * @example
 * ```typescript
 * // Input: text = "Hello World", search = "world"
 * // Output: "Hello <mark>World</mark>"
 * ```
 */
@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  /**
   * Transforme le texte en ajoutant des balises <mark> autour des occurrences du terme recherché.
   * 
   * @param text - Le texte dans lequel rechercher
   * @param search - Le terme à mettre en surbrillance
   * @returns Le texte avec les occurrences entourées de balises <mark>, ou le texte original si search est vide
   */
  transform(text: string, search: string): string {
    if (!search || !text) return text;
    
    const pattern = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(pattern, 'gi');
    
    return text.replace(regex, (match) => `<mark>${match}</mark>`);
  }
}
