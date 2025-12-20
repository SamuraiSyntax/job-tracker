import { StatutCandidature } from './statut-candidature.enum';
import { Priorite } from './priorite.enum';
import { CanalContact } from './canal-contact.enum';
import { TypeContrat } from './type-contrat.enum';
import { TypeRemuneration } from './type-remuneration.enum';
import { TypeTeletravail } from './type-teletravail.enum';

export interface Candidature {
  id: number;
  entreprise: string;
  poste: string;
  localisation: string;
  lienOffre?: string;
  description?: string;
  dateCandidature: Date;
  dateDernierContact?: Date;
  dateRelancePrevue?: Date;
  statut: StatutCandidature;
  priorite?: Priorite;
  archivee?: boolean;
  contactNom?: string;
  contactEmail?: string;
  contactTelephone?: string;
  contactLinkedin?: string;
  contactSite?: string;
  canalContact?: CanalContact;
  typeContrat?: TypeContrat;
  salaireMin?: number;
  salaireMax?: number;
  typeRemuneration?: TypeRemuneration;
  typeTeletravail?: TypeTeletravail;
  joursTeletravailParSemaine?: number;
  score?: number;
  source?: string;
  userId: number;
}
