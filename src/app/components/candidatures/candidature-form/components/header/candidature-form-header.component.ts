import { Component, Input, ChangeDetectionStrategy, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    
    selector: 'app-candidature-form-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './candidature-form-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureFormHeaderComponent {
    @Input() isEditMode = false;
    @Input() currentStep!: Signal<number>;
    @Input() isStep1Valid!: Signal<boolean>;
    @Input() isStep2Valid!: Signal<boolean>;
    @Input() isStep3Valid!: Signal<boolean>;
    @Input() isStep4Valid!: Signal<boolean>;
    @Input() goToStep!: (step: number) => void;
}