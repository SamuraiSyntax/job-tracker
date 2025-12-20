import { Injectable } from '@angular/core';

/**
 * Service centralisé pour gérer le stockage local (localStorage/sessionStorage)
 * Fournit une API type-safe avec gestion d'erreurs robuste
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  /**
   * Récupère une valeur depuis localStorage
   * @param key - Clé de stockage
   * @returns La valeur stockée ou null si inexistante/erreur
   * 
   * @example
   * ```typescript
   * const token = this.storage.getItem('auth_token');
   * ```
   */
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Erreur lors de la lecture de localStorage[${key}]:`, error);
      return null;
    }
  }

  /**
   * Récupère et parse une valeur JSON depuis localStorage
   * @param key - Clé de stockage
   * @returns L'objet parsé ou null si inexistant/erreur
   * 
   * @example
   * ```typescript
   * const user = this.storage.getItemParsed<User>('current_user');
   * ```
   */
  getItemParsed<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Erreur lors du parsing de localStorage[${key}]:`, error);
      return null;
    }
  }

  /**
   * Stocke une valeur dans localStorage
   * @param key - Clé de stockage
   * @param value - Valeur à stocker
   * @returns true si succès, false sinon
   * 
   * @example
   * ```typescript
   * this.storage.setItem('auth_token', token);
   * ```
   */
  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Erreur lors de l'écriture dans localStorage[${key}]:`, error);
      return false;
    }
  }

  /**
   * Stocke un objet en JSON dans localStorage
   * @param key - Clé de stockage
   * @param value - Objet à stocker
   * @returns true si succès, false sinon
   * 
   * @example
   * ```typescript
   * this.storage.setItemStringified('current_user', user);
   * ```
   */
  setItemStringified<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Erreur lors de la sérialisation dans localStorage[${key}]:`, error);
      return false;
    }
  }

  /**
   * Supprime une valeur de localStorage
   * @param key - Clé à supprimer
   * @returns true si succès, false sinon
   * 
   * @example
   * ```typescript
   * this.storage.removeItem('auth_token');
   * ```
   */
  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de localStorage[${key}]:`, error);
      return false;
    }
  }

  /**
   * Supprime toutes les valeurs de localStorage
   * @returns true si succès, false sinon
   * 
   * @example
   * ```typescript
   * this.storage.clear();
   * ```
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erreur lors du nettoyage de localStorage:', error);
      return false;
    }
  }

  /**
   * Vérifie si une clé existe dans localStorage
   * @param key - Clé à vérifier
   * @returns true si la clé existe, false sinon
   * 
   * @example
   * ```typescript
   * if (this.storage.hasItem('auth_token')) {
   *   // Token présent
   * }
   * ```
   */
  hasItem(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Erreur lors de la vérification de localStorage[${key}]:`, error);
      return false;
    }
  }

  /**
   * Récupère toutes les clés de localStorage
   * @returns Tableau des clés ou tableau vide si erreur
   * 
   * @example
   * ```typescript
   * const keys = this.storage.keys();
   * console.log('Clés stockées:', keys);
   * ```
   */
  keys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Erreur lors de la récupération des clés de localStorage:', error);
      return [];
    }
  }

  /**
   * Retourne le nombre d'éléments dans localStorage
   * @returns Nombre d'éléments ou 0 si erreur
   * 
   * @example
   * ```typescript
   * const count = this.storage.length();
   * console.log(`${count} éléments stockés`);
   * ```
   */
  length(): number {
    try {
      return localStorage.length;
    } catch (error) {
      console.error('Erreur lors du comptage des éléments de localStorage:', error);
      return 0;
    }
  }
}
