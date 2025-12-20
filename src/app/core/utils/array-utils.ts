/**
 * Utilitaires pour la manipulation de tableaux avec typage strict
 */

/**
 * Type pour la direction de tri
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Fonction de comparaison générique pour le tri
 */
type CompareFn<T> = (a: T, b: T) => number;

/**
 * Trie un tableau par une propriété spécifique de manière type-safe.
 * 
 * @template T - Type des éléments du tableau
 * @param array - Le tableau à trier
 * @param key - La clé de l'objet sur laquelle trier
 * @param order - Direction du tri ('asc' ou 'desc')
 * @returns Un nouveau tableau trié
 * 
 * @example
 * ```typescript
 * const users = [{ name: 'Bob', age: 30 }, { name: 'Alice', age: 25 }];
 * const sorted = sortByKey(users, 'name', 'asc');
 * // [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]
 * ```
 */
export function sortByKey<T>(
  array: T[],
  key: keyof T,
  order: SortOrder = 'asc'
): T[] {
  if (!array || array.length === 0) return [];

  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    // Gestion des valeurs nulles/undefined
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return order === 'asc' ? 1 : -1;
    if (bVal == null) return order === 'asc' ? -1 : 1;

    // Comparaison
    let comparison = 0;
    if (aVal < bVal) comparison = -1;
    if (aVal > bVal) comparison = 1;

    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Trie un tableau avec une fonction de comparaison personnalisée.
 * 
 * @template T - Type des éléments du tableau
 * @param array - Le tableau à trier
 * @param compareFn - Fonction de comparaison personnalisée
 * @param order - Direction du tri
 * @returns Un nouveau tableau trié
 * 
 * @example
 * ```typescript
 * const items = [{ priority: 'high' }, { priority: 'low' }];
 * const sorted = sortByCompare(items, (a, b) => 
 *   a.priority === 'high' ? -1 : 1
 * );
 * ```
 */
export function sortByCompare<T>(
  array: T[],
  compareFn: CompareFn<T>,
  order: SortOrder = 'asc'
): T[] {
  if (!array || array.length === 0) return [];

  const sorted = [...array].sort(compareFn);
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Filtre un tableau par une recherche textuelle sur plusieurs propriétés.
 * 
 * @template T - Type des éléments du tableau
 * @param array - Le tableau à filtrer
 * @param searchTerm - Terme de recherche (insensible à la casse)
 * @param searchKeys - Clés sur lesquelles effectuer la recherche
 * @returns Un nouveau tableau filtré
 * 
 * @example
 * ```typescript
 * const candidatures = [
 *   { entreprise: 'Google', poste: 'Dev' },
 *   { entreprise: 'Meta', poste: 'Designer' }
 * ];
 * const results = filterBySearch(candidatures, 'goo', ['entreprise', 'poste']);
 * // [{ entreprise: 'Google', poste: 'Dev' }]
 * ```
 */
export function filterBySearch<T>(
  array: T[],
  searchTerm: string,
  searchKeys: (keyof T)[]
): T[] {
  if (!array || array.length === 0) return [];
  if (!searchTerm || searchTerm.trim() === '') return array;

  const normalizedSearch = searchTerm.toLowerCase().trim();

  return array.filter(item =>
    searchKeys.some(key => {
      const value = item[key];
      if (value == null) return false;
      
      return String(value)
        .toLowerCase()
        .includes(normalizedSearch);
    })
  );
}

/**
 * Filtre un tableau par une valeur de propriété spécifique.
 * 
 * @template T - Type des éléments du tableau
 * @template K - Type de la clé
 * @param array - Le tableau à filtrer
 * @param key - La clé de l'objet sur laquelle filtrer
 * @param value - La valeur à comparer
 * @returns Un nouveau tableau filtré
 * 
 * @example
 * ```typescript
 * const items = [
 *   { status: 'active', name: 'A' },
 *   { status: 'inactive', name: 'B' }
 * ];
 * const active = filterByProperty(items, 'status', 'active');
 * // [{ status: 'active', name: 'A' }]
 * ```
 */
export function filterByProperty<T, K extends keyof T>(
  array: T[],
  key: K,
  value: T[K]
): T[] {
  if (!array || array.length === 0) return [];
  
  return array.filter(item => item[key] === value);
}

/**
 * Filtre un tableau avec un prédicat personnalisé.
 * 
 * @template T - Type des éléments du tableau
 * @param array - Le tableau à filtrer
 * @param predicate - Fonction de prédicat
 * @returns Un nouveau tableau filtré
 * 
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const evens = filterBy(numbers, n => n % 2 === 0);
 * // [2, 4]
 * ```
 */
export function filterBy<T>(
  array: T[],
  predicate: (item: T) => boolean
): T[] {
  if (!array || array.length === 0) return [];
  
  return array.filter(predicate);
}

/**
 * Combine recherche textuelle et filtrage par propriété.
 * 
 * @template T - Type des éléments du tableau
 * @template K - Type de la clé de filtrage
 * @param array - Le tableau à filtrer
 * @param options - Options de filtrage
 * @returns Un nouveau tableau filtré
 * 
 * @example
 * ```typescript
 * const candidatures = [...];
 * const filtered = combineFilters(candidatures, {
 *   searchTerm: 'dev',
 *   searchKeys: ['entreprise', 'poste'],
 *   filterKey: 'statut',
 *   filterValue: 'APPLIQUEE'
 * });
 * ```
 */
export function combineFilters<T, K extends keyof T>(
  array: T[],
  options: {
    searchTerm?: string;
    searchKeys?: (keyof T)[];
    filterKey?: K;
    filterValue?: T[K];
  }
): T[] {
  let result = array;

  // Appliquer la recherche textuelle
  if (options.searchTerm && options.searchKeys) {
    result = filterBySearch(result, options.searchTerm, options.searchKeys);
  }

  // Appliquer le filtre par propriété
  if (options.filterKey !== undefined && options.filterValue !== undefined) {
    result = filterByProperty(result, options.filterKey, options.filterValue);
  }

  return result;
}

/**
 * Pagine un tableau.
 * 
 * @template T - Type des éléments du tableau
 * @param array - Le tableau à paginer
 * @param page - Numéro de page (commence à 1)
 * @param pageSize - Nombre d'éléments par page
 * @returns Un nouveau tableau avec les éléments de la page
 * 
 * @example
 * ```typescript
 * const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * const page2 = paginate(items, 2, 3);
 * // [4, 5, 6]
 * ```
 */
export function paginate<T>(
  array: T[],
  page: number,
  pageSize: number
): T[] {
  if (!array || array.length === 0 || page < 1 || pageSize < 1) {
    return [];
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return array.slice(startIndex, endIndex);
}

/**
 * Obtient des informations de pagination.
 * 
 * @template T - Type des éléments du tableau
 * @param array - Le tableau
 * @param page - Numéro de page actuel
 * @param pageSize - Nombre d'éléments par page
 * @returns Informations de pagination
 * 
 * @example
 * ```typescript
 * const items = Array.from({ length: 50 }, (_, i) => i);
 * const info = getPaginationInfo(items, 2, 10);
 * // { totalItems: 50, totalPages: 5, currentPage: 2, pageSize: 10, hasNext: true, hasPrev: true }
 * ```
 */
export function getPaginationInfo<T>(
  array: T[],
  page: number,
  pageSize: number
): {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const totalItems = array?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
