import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidature } from '@models/index';

@Component({
    selector: '[appCandidatureTimeline]',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './timeline.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureTimelineComponent {
    @Input() candidature: Candidature | null = null;
}
