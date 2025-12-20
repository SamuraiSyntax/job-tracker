import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormFieldErrorComponent } from '@components/shared';
import { TypeContrat } from '@models/index';

@Component({
    selector: 'app-candidature-form-step1',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormFieldErrorComponent],
    templateUrl: './candidature-form-step1.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureFormStep1Component {
    @Input() form!: FormGroup;
    @Input() typesContrat: TypeContrat[] = [];
    @Input() getTypeContratLabel!: (v: TypeContrat) => string;
}