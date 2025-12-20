/**
 * Utilitaires pour les calculs statistiques
 */

/**
 * Calcule le taux de conversion entre deux nombres
 * @param numerator - Le numérateur (ex: nombre d'offres)
 * @param denominator - Le dénominateur (ex: nombre total de candidatures)
 * @returns Le taux de conversion en pourcentage (arrondi), ou 0 si le dénominateur est 0
 * 
 * @example
 * ```typescript
 * calculateConversionRate(5, 20) // 25
 * calculateConversionRate(0, 20) // 0
 * calculateConversionRate(5, 0)  // 0
 * ```
 */
export function calculateConversionRate(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

/**
 * Calcule la moyenne d'un tableau de nombres
 * @param values - Tableau de nombres
 * @returns La moyenne arrondie, ou 0 si le tableau est vide
 * 
 * @example
 * ```typescript
 * calculateAverage([10, 20, 30]) // 20
 * calculateAverage([]) // 0
 * ```
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / values.length);
}

/**
 * Calcule le total d'une propriété numérique dans un tableau d'objets
 * @param items - Tableau d'objets
 * @param propertyName - Nom de la propriété numérique à sommer
 * @returns La somme totale
 * 
 * @example
 * ```typescript
 * const stats = [{ total: 5 }, { total: 10 }, { total: 3 }];
 * calculateTotal(stats, 'total') // 18
 * ```
 */
export function calculateTotal<T>(items: T[], propertyName: keyof T): number {
  return items.reduce((sum, item) => {
    const value = item[propertyName];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
}

/**
 * Trouve l'élément avec la valeur maximale d'une propriété
 * @param items - Tableau d'objets
 * @param propertyName - Nom de la propriété à comparer
 * @returns L'élément avec la valeur max, ou null si le tableau est vide
 * 
 * @example
 * ```typescript
 * const data = [{ day: 'lundi', count: 5 }, { day: 'mardi', count: 12 }];
 * findMaxByProperty(data, 'count') // { day: 'mardi', count: 12 }
 * ```
 */
export function findMaxByProperty<T>(items: T[], propertyName: keyof T): T | null {
  if (items.length === 0) return null;
  
  return items.reduce((max, item) => {
    const maxValue = max[propertyName];
    const itemValue = item[propertyName];
    
    if (typeof maxValue === 'number' && typeof itemValue === 'number') {
      return itemValue > maxValue ? item : max;
    }
    return max;
  });
}

/**
 * Calcule le pourcentage qu'un nombre représente par rapport à un total
 * @param value - La valeur
 * @param total - Le total
 * @returns Le pourcentage arrondi, ou 0 si le total est 0
 * 
 * @example
 * ```typescript
 * calculatePercentage(25, 100) // 25
 * calculatePercentage(1, 3) // 33
 * ```
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
