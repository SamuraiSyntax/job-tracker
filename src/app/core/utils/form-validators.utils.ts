import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validateur personnalisé pour vérifier que deux champs de mot de passe correspondent
 * @param passwordField - Nom du champ du nouveau mot de passe
 * @param confirmPasswordField - Nom du champ de confirmation du mot de passe
 * @returns ValidatorFn qui retourne une erreur si les mots de passe ne correspondent pas
 * 
 * @example
 * ```typescript
 * this.passwordForm = this.fb.group({
 *   newPassword: ['', Validators.required],
 *   confirmPassword: ['', Validators.required]
 * }, {
 *   validators: passwordMatchValidator('newPassword', 'confirmPassword')
 * });
 * ```
 */
export function passwordMatchValidator(
  passwordField = 'newPassword',
  confirmPasswordField = 'confirmPassword'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get(passwordField);
    const confirmPassword = formGroup.get(confirmPasswordField);

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  };
}

/**
 * Validateur personnalisé pour vérifier que deux emails correspondent
 * @param emailField - Nom du champ email
 * @param confirmEmailField - Nom du champ de confirmation email
 * @returns ValidatorFn qui retourne une erreur si les emails ne correspondent pas
 * 
 * @example
 * ```typescript
 * this.emailForm = this.fb.group({
 *   email: ['', [Validators.required, Validators.email]],
 *   confirmEmail: ['', Validators.required]
 * }, {
 *   validators: emailMatchValidator('email', 'confirmEmail')
 * });
 * ```
 */
export function emailMatchValidator(
  emailField = 'email',
  confirmEmailField = 'confirmEmail'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const email = formGroup.get(emailField);
    const confirmEmail = formGroup.get(confirmEmailField);

    if (!email || !confirmEmail) {
      return null;
    }

    if (email.value !== confirmEmail.value) {
      return { emailMismatch: true };
    }

    return null;
  };
}

/**
 * Validateur pour vérifier le format d'un numéro de téléphone français
 * @param control - Le contrôle à valider
 * @returns ValidationErrors si le format est invalide, null sinon
 * 
 * @example
 * ```typescript
 * this.phoneControl = this.fb.control('', [Validators.required, phoneValidator]);
 * ```
 */
export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  // Format français: 01 23 45 67 89, 0123456789, +33123456789, etc.
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  
  if (!phoneRegex.test(control.value)) {
    return { invalidPhone: true };
  }

  return null;
}

/**
 * Validateur pour vérifier le format d'un code postal français
 * @param control - Le contrôle à valider
 * @returns ValidationErrors si le format est invalide, null sinon
 * 
 * @example
 * ```typescript
 * this.zipCodeControl = this.fb.control('', [Validators.required, postalCodeValidator]);
 * ```
 */
export function postalCodeValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  // Format français: 5 chiffres
  const postalCodeRegex = /^\d{5}$/;
  
  if (!postalCodeRegex.test(control.value)) {
    return { invalidPostalCode: true };
  }

  return null;
}

/**
 * Validateur pour vérifier qu'une URL est valide
 * @param control - Le contrôle à valider
 * @returns ValidationErrors si l'URL est invalide, null sinon
 * 
 * @example
 * ```typescript
 * this.urlControl = this.fb.control('', [Validators.required, urlValidator]);
 * ```
 */
export function urlValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  try {
    new URL(control.value);
    return null;
  } catch {
    return { invalidUrl: true };
  }
}

/**
 * Validateur pour vérifier la force d'un mot de passe
 * Exige au moins: 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial et 8 caractères minimum
 * @param control - Le contrôle à valider
 * @returns ValidationErrors si le mot de passe est faible, null sinon
 * 
 * @example
 * ```typescript
 * this.passwordControl = this.fb.control('', [Validators.required, strongPasswordValidator]);
 * ```
 */
export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const password = control.value;
  const errors: ValidationErrors = {};

  // Au moins une majuscule
  if (!/[A-Z]/.test(password)) {
    errors['noUpperCase'] = true;
  }

  // Au moins une minuscule
  if (!/[a-z]/.test(password)) {
    errors['noLowerCase'] = true;
  }

  // Au moins un chiffre
  if (!/\d/.test(password)) {
    errors['noNumber'] = true;
  }

  // Au moins un caractère spécial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors['noSpecialChar'] = true;
  }

  // Minimum 8 caractères
  if (password.length < 8) {
    errors['minLength'] = true;
  }

  return Object.keys(errors).length > 0 ? { weakPassword: errors } : null;
}

/**
 * Validateur pour vérifier qu'une date n'est pas dans le passé
 * @param control - Le contrôle à valider
 * @returns ValidationErrors si la date est dans le passé, null sinon
 * 
 * @example
 * ```typescript
 * this.dateControl = this.fb.control('', [Validators.required, futureDateValidator]);
 * ```
 */
export function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { pastDate: true };
  }

  return null;
}

/**
 * Validateur pour vérifier qu'une date n'est pas dans le futur
 * @param control - Le contrôle à valider
 * @returns ValidationErrors si la date est dans le futur, null sinon
 * 
 * @example
 * ```typescript
 * this.birthDateControl = this.fb.control('', [Validators.required, pastDateValidator]);
 * ```
 */
export function pastDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (selectedDate > today) {
    return { futureDate: true };
  }

  return null;
}
