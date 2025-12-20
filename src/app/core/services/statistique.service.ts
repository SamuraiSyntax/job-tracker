import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { StatistiquesGlobales, StatistiquesParMois, StatistiquesParJour } from '@models/index';

/**
 * Service de gestion des statistiques de candidatures
 * 
 * Fournit des données agrégées et des métriques sur les candidatures de l'utilisateur.
 * Toutes les requêtes incluent un timeout de 10 secondes et une gestion d'erreur robuste.
 * 
 * @example
 * ```typescript
 * // Injection du service
 * private statsService = inject(StatistiqueService);
 * 
 * // Récupérer les statistiques globales
 * this.statsService.getStatistiquesGlobales().subscribe(stats => {
 *   console.log('Total:', stats.total);
 *   console.log('En cours:', stats.enCours);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
  private readonly API_URL = `${environment.apiUrl}/candidatures/stats`;
  private http = inject(HttpClient);

  /**
   * Récupère les statistiques globales de toutes les candidatures
   * 
   * Retourne un résumé complet incluant :
   * - Nombre total de candidatures
   * - Répartition par statut (en cours, acceptées, refusées, sans réponse)
   * - Taux de conversion
   * - Moyennes et tendances
   * 
   * @returns Observable<StatistiquesGlobales> Statistiques agrégées
   * @throws Erreur timeout après 10 secondes
   * @throws Erreur serveur si l'API est inaccessible
   * 
   * @example
   * ```typescript
   * this.service.getStatistiquesGlobales().subscribe({
   *   next: (stats) => {
   *     console.log(`${stats.total} candidatures`);
   *     console.log(`Taux de succès: ${stats.tauxSucces}%`);
   *   },
   *   error: (err) => console.error('Erreur chargement stats:', err)
   * });
   * ```
   */
  getStatistiquesGlobales(): Observable<StatistiquesGlobales> {
    return this.http.get<StatistiquesGlobales>(`${this.API_URL}/globales`).pipe(
      timeout(10000),
      catchError(error => {
        console.error('Erreur stats:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Récupère les statistiques par mois
   * 
   * Retourne l'évolution mensuelle des candidatures avec :
   * - Nombre de candidatures par mois
   * - Répartition par statut pour chaque mois
   * - Comparaisons période sur période
   * 
   * Utile pour les graphiques d'évolution temporelle.
   * 
   * @returns Observable<StatistiquesParMois[]> Tableau des statistiques mensuelles
   * @throws Erreur timeout après 10 secondes
   * 
   * @example
   * ```typescript
   * this.service.getStatistiquesParMois().subscribe({
   *   next: (mensuel) => {
   *     mensuel.forEach(mois => {
   *       console.log(`${mois.mois}: ${mois.total} candidatures`);
   *     });
   *   },
   *   error: (err) => console.error('Erreur stats mensuelles:', err)
   * });
   * ```
   */
  getStatistiquesParMois(): Observable<StatistiquesParMois[]> {
    return this.http.get<StatistiquesParMois[]>(`${this.API_URL}/par-mois`).pipe(
      timeout(10000),
      catchError(error => {
        console.error('Erreur stats mensuelles:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Récupère les statistiques par jour
   * 
   * Retourne les données journalières sur les 30 derniers jours avec :
   * - Nombre de candidatures par jour
   * - Répartition détaillée par statut
   * - Liste des candidatures pour chaque jour
   * 
   * Utile pour les graphiques de tendance et l'analyse granulaire.
   * 
   * @returns Observable<StatistiquesParJour[]> Tableau des statistiques journalières
   * @throws Erreur timeout après 10 secondes
   * 
   * @example
   * ```typescript
   * this.service.getStatistiquesParJour().subscribe({
   *   next: (journalier) => {
   *     // Utiliser pour graphique ECharts
   *     const dates = journalier.map(j => j.date);
   *     const totaux = journalier.map(j => j.total);
   *     // Créer le graphique...
   *   },
   *   error: (err) => console.error('Erreur stats journalières:', err)
   * });
   * ```
   */
  getStatistiquesParJour(): Observable<StatistiquesParJour[]> {
    return this.http.get<StatistiquesParJour[]>(`${this.API_URL}/par-jour`).pipe(
      timeout(10000),
      catchError(error => {
        console.error('Erreur stats journalières:', error);
        return throwError(() => error);
      })
    );
  }
}
