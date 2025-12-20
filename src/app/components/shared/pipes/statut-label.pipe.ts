import { Pipe, PipeTransform } from '@angular/core';
import { StatutCandidature } from '@models/index';

/**
 * Pipe pour convertir un statut de candidature en libellé lisible.
 * 
 * @example
 * ```html
 * <span>{{ candidature.statut | statutLabel }}</span>
 * ```
 * 
 * @example
 * ```typescript
 * // Input: StatutCandidature.APPLIQUEE
 * // Output: "Postulée"
 * // Input: StatutCandidature.ENTRETIEN_TECHNIQUE
 * // Output: "Entretien Technique"
 * ```
 */
@Pipe({
  name: 'statutLabel',
  standalone: true
})
export class StatutLabelPipe implements PipeTransform {
  private readonly labels: Record<StatutCandidature, string> = {
    [StatutCandidature.APPLIQUEE]: 'Postulée',
    [StatutCandidature.ENTRETIEN_TELEPHONIQUE]: 'Entretien Téléphonique',
    [StatutCandidature.ENTRETIEN_TECHNIQUE]: 'Entretien Technique',
    [StatutCandidature.ENTRETIEN_RH]: 'Entretien RH',
    [StatutCandidature.OFFRE]: 'Offre Reçue',
    [StatutCandidature.REFUSEE]: 'Refusée',
    [StatutCandidature.SANS_REPONSE]: 'Sans Réponse'
  };

  /**
   * Transforme un statut de candidature en son libellé français.
   * 
   * @param value - Le statut de candidature à convertir
   * @returns Le libellé en français du statut, ou le statut brut si non trouvé
   */
  transform(value: StatutCandidature): string {
    return this.labels[value] || value;
  }
}
