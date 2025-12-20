import { Injectable, signal, computed } from '@angular/core';
import { Toast } from '@models/index';

/**
 * Service de gestion des notifications toast
 * Utilise les Signals Angular 21 pour une réactivité optimale
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastId = 0;
  
  // Signal pour la liste des toasts actifs
  private toastsState = signal<Toast[]>([]);
  
  /**
   * Toasts actuellement affichés (readonly)
   */
  readonly toasts = this.toastsState.asReadonly();
  
  /**
   * Nombre de toasts actifs
   */
  readonly toastCount = computed(() => this.toasts().length);
  
  /**
   * Vérifie s'il y a des toasts actifs
   */
  readonly hasToasts = computed(() => this.toastCount() > 0);

  /**
   * Affiche une notification
   * @private
   */
  private show(message: string, type: Toast['type'], duration: number): void {
    const toast: Toast = {
      id: ++this.toastId,
      message,
      type,
      duration
    };
    
    // Ajoute le toast au state
    this.toastsState.update(toasts => [...toasts, toast]);
    
    // Suppression automatique après la durée spécifiée
    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  /**
   * Supprime un toast par son ID
   * @param id - Identifiant du toast à supprimer
   */
  remove(id: number): void {
    this.toastsState.update(toasts => toasts.filter(t => t.id !== id));
  }

  /**
   * Affiche un toast de succès
   * @param message - Message à afficher
   * @param duration - Durée d'affichage en ms (défaut: 3000)
   */
  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  /**
   * Affiche un toast d'erreur
   * @param message - Message à afficher
   * @param duration - Durée d'affichage en ms (défaut: 5000)
   */
  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Affiche un toast d'information
   * @param message - Message à afficher
   * @param duration - Durée d'affichage en ms (défaut: 3000)
   */
  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  /**
   * Affiche un toast d'avertissement
   * @param message - Message à afficher
   * @param duration - Durée d'affichage en ms (défaut: 4000)
   */
  warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Supprime tous les toasts
   */
  clearAll(): void {
    this.toastsState.set([]);
  }
}
