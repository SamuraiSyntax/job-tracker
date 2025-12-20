import { Pipe, PipeTransform } from '@angular/core';
import { filterBySearch, filterByProperty, combineFilters } from '@core/utils/array-utils';

/**
 * Pipe pour filtrer un tableau par recherche textuelle sur plusieurs propriétés.
 * 
 * @example
 * ```html
 * <!-- Recherche simple -->
 * @for (item of items | filterArray:searchTerm:['name', 'description']; track item.id) {
 *   <div>{{ item.name }}</div>
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Dans un composant
 * filteredItems = computed(() => 
 *   this.filterPipe.transform(this.items(), this.searchTerm(), ['name', 'email'])
 * );
 * ```
 */
@Pipe({
  name: 'filterArray',
  standalone: true,
  pure: true
})
export class FilterArrayPipe implements PipeTransform {
  /**
   * Filtre un tableau par recherche textuelle.
   * 
   * @param array - Le tableau à filtrer
   * @param searchTerm - Terme de recherche (optionnel)
   * @param searchKeys - Clés sur lesquelles effectuer la recherche
   * @returns Le tableau filtré
   */
  transform<T>(
    array: T[] | null | undefined,
    searchTerm?: string,
    searchKeys?: (keyof T)[]
  ): T[] {
    if (!array) return [];
    if (!searchTerm || !searchKeys || searchKeys.length === 0) return array;

    return filterBySearch(array, searchTerm, searchKeys);
  }
}

/**
 * Pipe pour filtrer un tableau par une propriété spécifique.
 * 
 * @example
 * ```html
 * <!-- Filtrer par statut -->
 * @for (item of items | filterByProp:'status':'active'; track item.id) {
 *   <div>{{ item.name }}</div>
 * }
 * ```
 */
@Pipe({
  name: 'filterByProp',
  standalone: true,
  pure: true
})
export class FilterByPropertyPipe implements PipeTransform {
  /**
   * Filtre un tableau par valeur de propriété.
   * 
   * @param array - Le tableau à filtrer
   * @param key - La clé de l'objet
   * @param value - La valeur à comparer
   * @returns Le tableau filtré
   */
  transform<T, K extends keyof T>(
    array: T[] | null | undefined,
    key?: K,
    value?: T[K]
  ): T[] {
    if (!array) return [];
    if (key === undefined || value === undefined) return array;

    return filterByProperty(array, key, value);
  }
}

/**
 * Pipe combiné pour filtrage multiple (recherche + propriété).
 * 
 * @example
 * ```html
 * <!-- Filtrage combiné -->
 * @for (candidature of candidatures | filterCombined:{
 *   searchTerm: searchTerm,
 *   searchKeys: ['entreprise', 'poste'],
 *   filterKey: 'statut',
 *   filterValue: selectedStatut
 * }; track candidature.id) {
 *   <div>{{ candidature.entreprise }}</div>
 * }
 * ```
 */
@Pipe({
  name: 'filterCombined',
  standalone: true,
  pure: true
})
export class FilterCombinedPipe implements PipeTransform {
  /**
   * Applique plusieurs filtres simultanément.
   * 
   * @param array - Le tableau à filtrer
   * @param options - Options de filtrage
   * @returns Le tableau filtré
   */
  transform<T, K extends keyof T>(
    array: T[] | null | undefined,
    options?: {
      searchTerm?: string;
      searchKeys?: (keyof T)[];
      filterKey?: K;
      filterValue?: T[K];
    }
  ): T[] {
    if (!array) return [];
    if (!options) return array;

    return combineFilters(array, options);
  }
}
