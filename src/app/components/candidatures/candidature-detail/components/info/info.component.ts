import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidature } from '@models/index';
import { PrioriteBadgeComponent } from '@shared/components/priorite-badge/priorite-badge.component';
import { TypeContratBadgeComponent } from '@shared/components/type-contrat-badge/type-contrat-badge.component';

@Component({
    selector: '[appCandidatureInfo]',
    standalone: true,
    imports: [CommonModule, PrioriteBadgeComponent, TypeContratBadgeComponent],
    templateUrl: './info.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureInfoComponent {
    @Input() candidature: Candidature | null = null;
}