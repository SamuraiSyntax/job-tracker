import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormFieldErrorComponent } from '@components/shared';
import { Component, Input, ChangeDetectionStrategy, OnInit, Signal, WritableSignal, signal, computed, inject, DestroyRef } from '@angular/core';
import { CanalContact } from '@models/index';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-candidature-form-step3',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormFieldErrorComponent],
    templateUrl: './candidature-form-step3.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureFormStep3Component implements OnInit {
    @Input() form!: FormGroup;
    @Input() canauxContact: CanalContact[] = [];
    @Input() getCanalContactLabel!: (v: CanalContact) => string;

    private destroyRef = inject(DestroyRef);

    // WritableSignal pour pouvoir .set(...)
    canalContactValue: WritableSignal<CanalContact | null> = signal(null);
    showEmailField: Signal<boolean> = signal(false);
    showPhoneField: Signal<boolean> = signal(false);
    showLinkedinField: Signal<boolean> = signal(false);
    showSiteField: Signal<boolean> = signal(false);

    ngOnInit(): void {
        const control = this.form?.get('canalContact');
        if (control) {
            this.canalContactValue.set(control.value);
            control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(v => {
                this.canalContactValue.set(v);
            });
        } else {
            this.canalContactValue.set(null);
        }

        this.showEmailField = computed(() => this.canalContactValue() === CanalContact.EMAIL);
        this.showPhoneField = computed(() => this.canalContactValue() === CanalContact.TELEPHONE);
        this.showLinkedinField = computed(() => this.canalContactValue() === CanalContact.LINKEDIN);
        this.showSiteField = computed(() => this.canalContactValue() === CanalContact.SITE);
    }
}