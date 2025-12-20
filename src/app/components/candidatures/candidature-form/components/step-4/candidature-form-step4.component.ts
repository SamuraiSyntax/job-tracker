import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormFieldErrorComponent } from '@components/shared';
import { Component, Input, ChangeDetectionStrategy, OnInit, Signal, WritableSignal, signal, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TypeRemuneration, TypeTeletravail } from '@models/index';

@Component({
    selector: 'app-candidature-form-step4',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormFieldErrorComponent],
    templateUrl: './candidature-form-step4.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureFormStep4Component implements OnInit {
    @Input() form!: FormGroup;
    @Input() typesRemuneration: TypeRemuneration[] = [];
    @Input() typesTeletravail: TypeTeletravail[] = [];
    @Input() getTypeRemunerationLabel!: (v: TypeRemuneration) => string;
    @Input() getTypeTeletravailLabel!: (v: TypeTeletravail) => string;

    private destroyRef = inject(DestroyRef);

    // WritableSignal pour mise à jour
    typeTeletravailValue: WritableSignal<TypeTeletravail | null> = signal(null);
    showJoursTeletravail: Signal<boolean> = signal(false);

    ngOnInit(): void {
        const control = this.form?.get('typeTeletravail');
        if (control) {
            this.typeTeletravailValue.set(control.value);
            control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(v => {
                this.typeTeletravailValue.set(v);
            });
        } else {
            this.typeTeletravailValue.set(null);
        }
        this.showJoursTeletravail = computed(() => this.typeTeletravailValue() === TypeTeletravail.PARTIEL);
    }
}