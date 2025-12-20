import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Candidature, TypeContrat, Priorite } from '@models/index';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';
import {
  getStatutBadgeClass,
  getStatutLabel,
  getPrioriteBadgeClass,
  getPrioriteLabel,
  getTypeContratBadgeClass,
  getTypeContratLabel
} from '@core/utils';

@Component({
  selector: 'app-candidature-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TimeAgoPipe
  ],
  templateUrl: './candidature-card.component.html'
})
export class CandidatureCardComponent {
  @Input() candidature!: Candidature;
  @Output() onArchive = new EventEmitter<number>();
  @Output() onDeleteFromTable = new EventEmitter<number>();

  readonly TypeContrat = TypeContrat;
  readonly Priorite = Priorite;
  getStatutBadgeClass = getStatutBadgeClass;
  getStatutLabel = getStatutLabel;
  getPrioriteBadgeClass = getPrioriteBadgeClass;
  getPrioriteLabel = getPrioriteLabel;
  getTypeContratBadgeClass = getTypeContratBadgeClass;
  getTypeContratLabel = getTypeContratLabel;
}