import { Candidature, Priorite, TypeContrat, StatutCandidature } from './index';

export interface FilterChipsData {
  searchTerm: string;
  selectedStatut: StatutCandidature | '';
  selectedPriorite: Priorite | '';
  selectedTypeContrat: TypeContrat | '';
  selectedScoreMin: number;
  selectedScoreMax: number;
  dateDebut: string;
  dateFin: string;
}

export interface CandidaturesState {
  data: Candidature[];
  loading: boolean;
  error: string | null;
}

import { StatistiquesGlobales, StatistiquesParJour } from './index';
export interface StatsState {
  globales: StatistiquesGlobales | null;
  journalieres: StatistiquesParJour[];
  candidatures: Candidature[];
  loading: boolean;
  error: string;
}

export interface TypeContratStat {
  type: TypeContrat;
  count: number;
  percentage: number;
}

export interface PrioriteStat {
  priorite: Priorite;
  count: number;
  percentage: number;
  tauxConversion?: number;
}

export interface DashboardState {
  stats: StatistiquesGlobales | null;
  recentCandidatures: Candidature[];
  allCandidatures: Candidature[];
  loading: boolean;
  error: string | null;
}
