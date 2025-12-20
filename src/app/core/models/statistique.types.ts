/**
 * Statistiques globales de l'utilisateur
 */
export interface StatistiquesGlobales {
  totalCandidatures: number;
  enCours: number;
  acceptees: number;
  refusees: number;
  entretiens: number;
  enAttente: number;
}

/**
 * Statistiques par mois
 */
export interface StatistiquesParMois {
  mois: string;
  total: number;
  acceptees: number;
  refusees: number;
}

/**
 * Résumé d'une candidature dans les statistiques
 */
export interface CandidatureResume {
  id: number;
  entreprise: string;
  poste: string;
  statut: string;
}

/**
 * Statistiques par jour avec détails des candidatures
 */
export interface StatistiquesParJour {
  jour: string;
  total: number;
  appliquees: number;
  entretiensTelephoniques: number;
  entretiensTechniques: number;
  entretiensRH: number;
  offres: number;
  refusees: number;
  sansReponse: number;
  candidatures: CandidatureResume[];
}
