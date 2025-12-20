import { Pipe, PipeTransform } from '@angular/core';
import { sortByKey, SortOrder } from '@core/utils/array-utils';

/**
 * Pipe pour trier un tableau par une propriété spécifique.
 * 
 * @example
 * ```html
 * <!-- Tri croissant par nom -->
 * @for (user of users | sortArray:'name':'asc'; track user.id) {
 *   <div>{{ user.name }}</div>
 * }
 * ```
 * 
 * @example
 * ```html
 * <!-- Tri décroissant par date -->
 * @for (item of items | sortArray:'dateCandidature':'desc'; track item.id) {
 *   <div>{{ item.dateCandidature | date }}</div>
 * }
 * ```
 */
@Pipe({
  name: 'sortArray',
  standalone: true,
  pure: true
})
export class SortArrayPipe implements PipeTransform {
  /**
   * Trie un tableau par une clé spécifique.
   * 
   * @param array - Le tableau à trier
   * @param key - La clé de l'objet sur laquelle trier (optionnel)
   * @param order - Direction du tri ('asc' ou 'desc', défaut: 'asc')
   * @returns Un nouveau tableau trié
   */
  transform<T>(
    array: T[] | null | undefined,
    key?: keyof T,
    order: SortOrder = 'asc'
  ): T[] {
    if (!array || array.length === 0) return [];
    if (!key) return array;

    return sortByKey(array, key, order);
  }
}
