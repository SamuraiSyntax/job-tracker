import { Component, Input, ChangeDetectionStrategy, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-candidature-form-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './candidature-form-footer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CandidatureFormFooterComponent {
    @Input() currentStep!: Signal<number>;
    @Input() totalSteps = 4;
    @Input() canGoToNextStep!: Signal<boolean>;
    @Input() isLastStep!: Signal<boolean>;
    @Input() isFirstStep!: Signal<boolean>;
    @Input() previousStep!: () => void;
    @Input() nextStep!: () => void;
    @Input() onCancel!: () => void;
    @Input() candidatureFormValid = false;
    @Input() isLoading = false;
    @Input() isEditMode = false;
}