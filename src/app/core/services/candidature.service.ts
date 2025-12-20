import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Candidature } from '@models/candidature.model';
import { StatutCandidature } from '@models/statut-candidature.enum';
import { environment } from '@env/environment';

/**
 * Service de gestion des candidatures
 * 
 * Utilise les Signals Angular 21 pour une réactivité optimale.
 * Combine signals avec observables pour une architecture moderne.
 * 
 * @example
 * ```typescript
 * // Injection du service
 * private candidatureService = inject(CandidatureService);
 * 
 * // Accès aux candidatures via signal
 * const candidatures = this.candidatureService.candidatures();
 * const total = this.candidatureService.totalCandidatures();
 * 
 * // Créer une nouvelle candidature
 * this.candidatureService.createCandidature(nouvelle).subscribe();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private readonly API_URL = `${environment.apiUrl}/candidatures`;
  private http = inject(HttpClient);

  // State management avec signals
  private candidaturesState = signal<Candidature[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  /**
   * Liste des candidatures (readonly)
   */
  readonly candidatures = this.candidaturesState.asReadonly();

  /**
   * État de chargement
   */
  readonly loading = this.loadingState.asReadonly();

  /**
   * Message d'erreur éventuel
   */
  readonly error = this.errorState.asReadonly();

  /**
   * Nombre total de candidatures
   */
  readonly totalCandidatures = computed(() => this.candidatures().length);

  /**
   * Candidatures actives (non archivées)
   */
  readonly activeCandidatures = computed(() => 
    this.candidatures().filter(c => !c.archivee)
  );

  /**
   * Nombre de candidatures actives
   */
  readonly totalActives = computed(() => this.activeCandidatures().length);

  /**
   * Candidatures par statut
   */
  readonly candidaturesByStatus = computed(() => {
    const byStatus = new Map<StatutCandidature, Candidature[]>();
    this.candidatures().forEach(c => {
      const existing = byStatus.get(c.statut) || [];
      byStatus.set(c.statut, [...existing, c]);
    });
    return byStatus;
  });

  /**
   * Charge toutes les candidatures
   */
  loadAll(): Observable<Candidature[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    return this.http.get<Candidature[]>(this.API_URL).pipe(
      tap({
        next: (candidatures) => {
          this.candidaturesState.set(candidatures);
          this.loadingState.set(false);
        },
        error: (error) => {
          this.errorState.set(error.message || 'Erreur lors du chargement');
          this.loadingState.set(false);
        }
      })
    );
  }

  /**
   * Récupère toutes les candidatures (méthode legacy pour compatibilité)
   */
  getAllCandidatures(): Observable<Candidature[]> {
    return this.loadAll();
  }

  /**
   * Récupère une candidature par ID
   */
  getCandidatureById(id: number): Observable<Candidature> {
    return this.http.get<Candidature>(`${this.API_URL}/${id}`);
  }

  /**
   * Crée une nouvelle candidature
   */
  createCandidature(candidature: Partial<Candidature>): Observable<Candidature> {
    return this.http.post<Candidature>(this.API_URL, candidature).pipe(
      tap({
        next: (newCandidature) => {
          // Ajoute la nouvelle candidature au state
          this.candidaturesState.update(current => [...current, newCandidature]);
        }
      })
    );
  }

  /**
   * Met à jour une candidature
   */
  updateCandidature(id: number, candidature: Partial<Candidature>): Observable<Candidature> {
    return this.http.put<Candidature>(`${this.API_URL}/${id}`, candidature).pipe(
      tap({
        next: (updated) => {
          // Met à jour la candidature dans le state
          this.candidaturesState.update(current =>
            current.map(c => c.id === id ? updated : c)
          );
        }
      })
    );
  }

  /**
   * Supprime une candidature
   */
  deleteCandidature(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap({
        next: () => {
          // Retire la candidature du state
          this.candidaturesState.update(current =>
            current.filter(c => c.id !== id)
          );
        }
      })
    );
  }

  /**
   * Met à jour le statut d'une candidature
   */
  updateStatut(id: number, statut: StatutCandidature): Observable<Candidature> {
    return this.http.patch<Candidature>(`${this.API_URL}/${id}/statut`, { statut }).pipe(
      tap({
        next: (updated) => {
          // Met à jour le statut dans le state
          this.candidaturesState.update(current =>
            current.map(c => c.id === id ? updated : c)
          );
        }
      })
    );
  }

  /**
   * Réinitialise l'état du service
   */
  reset(): void {
    this.candidaturesState.set([]);
    this.loadingState.set(false);
    this.errorState.set(null);
  }
}
