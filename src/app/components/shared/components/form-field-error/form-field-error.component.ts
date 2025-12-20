import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-field-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldErrorComponent {
  control = input<AbstractControl | null | undefined>();
  fieldName = input<string>('Ce champ');
  customErrors = input<Record<string, string> | undefined>();

  getCustomErrors(): { key: string, message: string }[] {
    const ctrl = this.control();
    const errors = this.customErrors();
    if (!ctrl?.errors || !errors) return [];

    return Object.keys(ctrl.errors)
      .filter(key => errors?.[key])
      .map(key => ({
        key,
        message: errors![key]
      }));
  }
}
