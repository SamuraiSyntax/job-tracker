import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeContrat } from '@models/index';
import { getTypeContratLabel } from '@core/utils';

@Component({
  selector: 'app-type-contrat-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-contrat-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeContratBadgeComponent {
  typeContrat = input.required<TypeContrat>();
  getTypeContratLabel = getTypeContratLabel;
}
