import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormFieldErrorComponent } from '@components/shared';
import { StatutCandidature, Priorite } from '@models/index';

@Component({
    selector: 'app-candidature-form-step2',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormFieldErrorComponent],
    templateUrl: './candidature-form-step2.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureFormStep2Component {
    @Input() form!: FormGroup;
    @Input() statuts: StatutCandidature[] = [];
    @Input() getStatutLabel!: (v: StatutCandidature) => string;
    @Input() priorites: Priorite[] = [];
    @Input() getPrioriteLabel!: (v: Priorite) => string;
}