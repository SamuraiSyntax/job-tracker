import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Configuration pour une demande de confirmation
 */
export interface ConfirmationConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    icon?: string;
}



/**
 * Service de gestion des confirmations avec modal personnalisé
 * 
 * Fournit une alternative moderne et personnalisable aux fenêtres confirm() natives du navigateur.
 * Utilise des signals Angular pour une gestion réactive de l'état du modal.
 * Les confirmations retournent des Observables pour un traitement asynchrone élégant.
 * 
 * @example
 * ```typescript
 * // Injection du service
 * private confirmService = inject(ConfirmationService);
 * 
 * // Confirmation personnalisée
 * this.confirmService.confirm({
 *   title: 'Action importante',
 *   message: 'Voulez-vous continuer ?',
 *   type: 'warning'
 * }).subscribe(confirmed => {
 *   if (confirmed) {
 *     // Action confirmée
 *   }
 * });
 * 
 * // Raccourci pour suppression
 * this.confirmService.confirmDelete('cette candidature').subscribe(confirmed => {
 *   if (confirmed) this.delete();
 * });
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class ConfirmationService {
    /**
     * Signal pour afficher/masquer le modal de confirmation
     * @private
     */
    private showModalSignal = signal(false);

    /**
     * Signal pour stocker la configuration actuelle du modal
     * @private
     */
    private currentConfigSignal = signal<ConfirmationConfig | null>(null);

    /**
     * Subject pour gérer la réponse asynchrone de l'utilisateur
     * @private
     */
    private resultSubject = new Subject<boolean>();

    /**
     * Getter pour le signal d'affichage du modal (lecture seule)
     * 
     * @returns Signal en lecture seule indiquant si le modal est visible
     */
    get showModal() {
        return this.showModalSignal.asReadonly();
    }

    /**
     * Getter pour la configuration actuelle du modal (lecture seule)
     * 
     * @returns Signal en lecture seule contenant la configuration du modal
     */
    get currentConfig() {
        return this.currentConfigSignal.asReadonly();
    }

    /**
     * Demande une confirmation à l'utilisateur via un modal personnalisé
     * 
     * Affiche un modal avec le titre, message et options spécifiés.
     * Retourne un Observable qui émet true si l'utilisateur confirme,
     * false si l'utilisateur annule, puis se complète automatiquement.
     * 
     * @param config - Configuration du message de confirmation
     * @param config.title - Titre du modal
     * @param config.message - Message principal à afficher
     * @param config.confirmText - Texte du bouton de confirmation (défaut: 'Confirmer')
     * @param config.cancelText - Texte du bouton d'annulation (défaut: 'Annuler')
     * @param config.type - Type de confirmation pour le style ('danger' | 'warning' | 'info' | 'success')
     * @param config.icon - Icône FontAwesome à afficher (défaut: 'fa-exclamation-triangle')
     * 
     * @returns Observable<boolean> - Émet true si confirmé, false si annulé
     * 
     * @example
     * ```typescript
     * this.confirmService.confirm({
     *   title: 'Archiver la candidature',
     *   message: 'Cette action déplacera la candidature dans les archives.',
     *   confirmText: 'Archiver',
     *   type: 'info',
     *   icon: 'fa-archive'
     * }).subscribe({
     *   next: (confirmed) => {
     *     if (confirmed) {
     *       this.archiveCandidature();
     *     }
     *   }
     * });
     * ```
     */
    confirm(config: ConfirmationConfig): Observable<boolean> {
        this.currentConfigSignal.set({
            ...config,
            confirmText: config.confirmText || 'Confirmer',
            cancelText: config.cancelText || 'Annuler',
            type: config.type || 'warning',
            icon: config.icon || 'fa-exclamation-triangle'
        });
        this.showModalSignal.set(true);

        return new Observable(observer => {
            const subscription = this.resultSubject.subscribe(result => {
                observer.next(result);
                observer.complete();
                subscription.unsubscribe();
            });
        });
    }

    /**
     * Raccourci pour une confirmation de suppression
     * 
     * Affiche un modal de confirmation pré-configuré pour les suppressions,
     * avec une icône de corbeille et un style 'danger' rouge.
     * 
     * @param itemName - Nom de l'élément à supprimer (sera affiché entre guillemets)
     * @returns Observable<boolean> - Émet true si l'utilisateur confirme la suppression
     * 
     * @example
     * ```typescript
     * onDeleteCandidature(candidature: Candidature) {
     *   this.confirmService
     *     .confirmDelete(`${candidature.entreprise} - ${candidature.poste}`)
     *     .subscribe(confirmed => {
     *       if (confirmed) {
     *         this.candidatureService.deleteCandidature(candidature.id).subscribe();
     *       }
     *     });
     * }
     * ```
     */
    confirmDelete(itemName: string): Observable<boolean> {
        return this.confirm({
            title: 'Confirmer la suppression',
            message: `Êtes-vous sûr de vouloir supprimer "${itemName}" ?`,
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            type: 'danger',
            icon: 'fa-trash'
        });
    }

    /**
     * Gère l'action de confirmation de l'utilisateur
     * 
     * Appelée quand l'utilisateur clique sur le bouton de confirmation.
     * Ferme le modal et émet true dans le Subject de résultat.
     */
    onConfirm(): void {
        this.closeModal();
        this.resultSubject.next(true);
    }

    /**
     * Gère l'action d'annulation de l'utilisateur
     * 
     * Appelée quand l'utilisateur clique sur le bouton d'annulation
     * ou ferme le modal. Ferme le modal et émet false dans le Subject.
     */
    onCancel(): void {
        this.closeModal();
        this.resultSubject.next(false);
    }

    /**
     * Ferme le modal et réinitialise l'état
     * 
     * Cache le modal et efface la configuration actuelle.
     * @private
     */
    private closeModal(): void {
        this.showModalSignal.set(false);
        this.currentConfigSignal.set(null);
    }
}
