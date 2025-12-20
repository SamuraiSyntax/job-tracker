import { Component, OnInit, inject, DestroyRef, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CandidatureService, NotificationService } from '@services/index';
import {
  StatutCandidature,
  Candidature
} from '@models/index';
import {
  getAllStatuts,
  getStatutLabel,
  getAllPriorites,
  getPrioriteLabel,
  getAllCanauxContact,
  getCanalContactLabel,
  getAllTypesContrat,
  getTypeContratLabel,
  formatDateToLocalString,
  getTypeRemunerationLabel,
  getAllTypesRemuneration,
  getTypeTeletravailLabel,
  getAllTypesTeletravail
} from '@core/utils';
import { CandidatureFormHeaderComponent } from './components/header/candidature-form-header.component';
import { CandidatureFormFooterComponent } from './components/footer/candidature-form-footer.component';
import { CandidatureFormStep1Component } from './components/step-1/candidature-form-step1.component';
import { CandidatureFormStep2Component } from './components/step-2/candidature-form-step2.component';
import { CandidatureFormStep3Component } from './components/step-3/candidature-form-step3.component';
import { CandidatureFormStep4Component } from './components/step-4/candidature-form-step4.component';

@Component({
  selector: 'app-candidature-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    CandidatureFormHeaderComponent,
    CandidatureFormFooterComponent,
    CandidatureFormStep1Component,
    CandidatureFormStep2Component,
    CandidatureFormStep3Component,
    CandidatureFormStep4Component],
  templateUrl: './candidature-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private candidatureService = inject(CandidatureService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  candidatureForm: FormGroup = this.fb.group({
    entreprise: ['', Validators.required],
    poste: ['', Validators.required],
    localisation: ['', Validators.required],
    lienOffre: [''],
    description: [''],
    dateCandidature: [formatDateToLocalString(new Date()), Validators.required],
    dateDernierContact: [''],
    dateRelancePrevue: [''],
    statut: [StatutCandidature.APPLIQUEE, Validators.required],
    priorite: [''],
    archivee: [false],
    contactNom: [''],
    contactEmail: ['', Validators.email],
    contactTelephone: [''],
    contactLinkedin: [''],
    contactSite: [''],
    canalContact: [''],
    typeContrat: [''],
    salaireMin: ['', [Validators.min(0)]],
    salaireMax: ['', [Validators.min(0)]],
    typeRemuneration: [''],
    typeTeletravail: [''],
    joursTeletravailParSemaine: ['', [Validators.min(1), Validators.max(5)]],
    score: ['', [Validators.min(1), Validators.max(5)]],
    source: ['']
  });

  statuts = getAllStatuts();
  getStatutLabel = getStatutLabel;

  priorites = getAllPriorites();
  getPrioriteLabel = getPrioriteLabel;

  canauxContact = getAllCanauxContact();
  getCanalContactLabel = getCanalContactLabel;

  typesContrat = getAllTypesContrat();
  getTypeContratLabel = getTypeContratLabel;

  typesRemuneration = getAllTypesRemuneration();
  getTypeRemunerationLabel = getTypeRemunerationLabel;

  typesTeletravail = getAllTypesTeletravail();
  getTypeTeletravailLabel = getTypeTeletravailLabel;

  isEditMode = false;
  candidatureId?: number;
  isLoading = false;

  // Gestion du stepper (4 étapes)
  currentStep = signal(1);
  totalSteps = 4;

  // Signal réactif pour les changements du formulaire (utilisé pour re-évaluer les computed)
  private formChanges = toSignal(this.candidatureForm.valueChanges, {
    initialValue: this.candidatureForm.value
  });
  private formStatus = toSignal(this.candidatureForm.statusChanges, {
    initialValue: this.candidatureForm.status
  });

  // NOTE: la logique de visibilité conditionnelle (canalContact / typeTeletravail)
  // a été déplacée dans les composants step-3 et step-4 (utilisant toSignal/computed).
  // Le parent n'expose plus ces signaux.

  // Validation par étape - réactives aux changements du formulaire
  isStep1Valid = computed(() => {
    this.formChanges();
    this.formStatus();

    const entreprise = this.candidatureForm.get('entreprise');
    const poste = this.candidatureForm.get('poste');
    const localisation = this.candidatureForm.get('localisation');

    return !!(
      entreprise?.value && entreprise?.valid &&
      poste?.value && poste?.valid &&
      localisation?.value && localisation?.valid
    );
  });

  isStep2Valid = computed(() => {
    this.formChanges();
    this.formStatus();

    const dateCandidature = this.candidatureForm.get('dateCandidature');
    const statut = this.candidatureForm.get('statut');

    return !!(
      dateCandidature?.value && dateCandidature?.valid &&
      statut?.value && statut?.valid
    );
  });

  isStep3Valid = computed(() => {
    this.formChanges();
    this.formStatus();

    const contactEmail = this.candidatureForm.get('contactEmail');
    const contactTelephone = this.candidatureForm.get('contactTelephone');
    const contactLinkedin = this.candidatureForm.get('contactLinkedin');
    const contactSite = this.candidatureForm.get('contactSite');

    // les champs conditionnels sont gérés visuellement par l'enfant ;
    // ici on vérifie simplement la validité si une valeur est fournie.
    return (!contactEmail?.value || !!contactEmail?.valid) &&
      (!contactTelephone?.value || !!contactTelephone?.valid) &&
      (!contactLinkedin?.value || !!contactLinkedin?.valid) &&
      (!contactSite?.value || !!contactSite?.valid);
  });

  isStep4Valid = computed(() => {
    this.formChanges();
    this.formStatus();

    const salaireMin = this.candidatureForm.get('salaireMin');
    const salaireMax = this.candidatureForm.get('salaireMax');
    const score = this.candidatureForm.get('score');
    const joursTeletravail = this.candidatureForm.get('joursTeletravailParSemaine');

    const valid = (!salaireMin?.value || salaireMin?.valid) &&
      (!salaireMax?.value || salaireMax?.valid) &&
      (!score?.value || score?.valid) &&
      (!joursTeletravail?.value || joursTeletravail?.valid);
    return !!valid;
  });

  canGoToNextStep = computed(() => {
    const step = this.currentStep();
    if (step === 1) return this.isStep1Valid();
    if (step === 2) return this.isStep2Valid();
    if (step === 3) return this.isStep3Valid();
    if (step === 4) return this.isStep4Valid();
    return false;
  });

  isLastStep = computed(() => this.currentStep() === this.totalSteps);
  isFirstStep = computed(() => this.currentStep() === 1);

  nextStep = (): void => {
    if (!this.canGoToNextStep()) {
      this.markCurrentStepAsTouched();
      return;
    }
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.set(this.currentStep() + 1);
      this.scrollToTop();
    }
  }

  previousStep = (): void => {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
      this.scrollToTop();
    }
  }

  goToStep = (step: number): void => {
    for (let i = 1; i < step; i++) {
      if (!this.getStepValidationStatus(i)) {
        this.currentStep.set(i);
        this.markCurrentStepAsTouched();
        return;
      }
    }
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep.set(step);
      this.scrollToTop();
    }
  }

  private markCurrentStepAsTouched(): void {
    const step = this.currentStep();
    let fieldsToMark: string[] = [];

    switch (step) {
      case 1:
        fieldsToMark = ['entreprise', 'poste', 'localisation'];
        break;
      case 2:
        fieldsToMark = ['dateCandidature', 'statut'];
        break;
      case 3:
        fieldsToMark = ['contactEmail', 'contactTelephone', 'contactLinkedin', 'contactSite'];
        break;
      case 4:
        fieldsToMark = ['salaireMin', 'salaireMax', 'score', 'joursTeletravailParSemaine'];
        break;
    }

    fieldsToMark.forEach(fieldName => {
      const control = this.candidatureForm.get(fieldName);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private getStepValidationStatus(step: number): boolean {
    if (step === 1) return this.isStep1Valid();
    if (step === 2) return this.isStep2Valid();
    if (step === 3) return this.isStep3Valid();
    if (step === 4) return this.isStep4Valid();
    return false;
  }

  ngOnInit(): void {
    this.candidatureId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.candidatureId) {
      this.isEditMode = true;
      this.loadCandidature();
    }
  }

  loadCandidature(): void {
    if (this.candidatureId) {
      this.candidatureService.getCandidatureById(this.candidatureId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (candidature) => {
            this.candidatureForm.patchValue({
              entreprise: candidature.entreprise,
              poste: candidature.poste,
              localisation: candidature.localisation,
              lienOffre: candidature.lienOffre || '',
              description: candidature.description || '',
              dateCandidature: formatDateToLocalString(candidature.dateCandidature),
              dateDernierContact: candidature.dateDernierContact ? formatDateToLocalString(candidature.dateDernierContact) : '',
              dateRelancePrevue: candidature.dateRelancePrevue ? formatDateToLocalString(candidature.dateRelancePrevue) : '',
              statut: candidature.statut,
              priorite: candidature.priorite,
              archivee: candidature.archivee || false,
              contactNom: candidature.contactNom || '',
              contactEmail: candidature.contactEmail || '',
              contactTelephone: candidature.contactTelephone || '',
              contactLinkedin: candidature.contactLinkedin || '',
              contactSite: candidature.contactSite || '',
              canalContact: candidature.canalContact,
              typeContrat: candidature.typeContrat,
              salaireMin: candidature.salaireMin || '',
              salaireMax: candidature.salaireMax || '',
              typeRemuneration: candidature.typeRemuneration,
              typeTeletravail: candidature.typeTeletravail,
              joursTeletravailParSemaine: candidature.joursTeletravailParSemaine || '',
              score: candidature.score || '',
              source: candidature.source || ''
            });
          },
          error: (error) => {
            console.error('❌ Erreur lors du chargement:', error);
          }
        });
    }
  }

  onSubmit(): void {
    if (this.candidatureForm.valid) {
      this.isLoading = true;
      const formValue = this.candidatureForm.value;

      const candidature: Partial<Candidature> = {
        entreprise: formValue.entreprise,
        poste: formValue.poste,
        localisation: formValue.localisation,
        lienOffre: formValue.lienOffre || undefined,
        description: formValue.description || undefined,
        dateCandidature: formValue.dateCandidature ? new Date(formValue.dateCandidature) : undefined,
        dateDernierContact: formValue.dateDernierContact ? new Date(formValue.dateDernierContact) : undefined,
        dateRelancePrevue: formValue.dateRelancePrevue ? new Date(formValue.dateRelancePrevue) : undefined,
        statut: formValue.statut,
        priorite: formValue.priorite || undefined,
        archivee: formValue.archivee || false,
        contactNom: formValue.contactNom || undefined,
        contactEmail: formValue.contactEmail || undefined,
        contactTelephone: formValue.contactTelephone || undefined,
        contactLinkedin: formValue.contactLinkedin || undefined,
        contactSite: formValue.contactSite || undefined,
        canalContact: formValue.canalContact || undefined,
        typeContrat: formValue.typeContrat || undefined,
        salaireMin: formValue.salaireMin ? Number(formValue.salaireMin) : undefined,
        salaireMax: formValue.salaireMax ? Number(formValue.salaireMax) : undefined,
        typeRemuneration: formValue.typeRemuneration || undefined,
        typeTeletravail: formValue.typeTeletravail || undefined,
        joursTeletravailParSemaine: formValue.joursTeletravailParSemaine ? Number(formValue.joursTeletravailParSemaine) : undefined,
        score: formValue.score ? Number(formValue.score) : undefined,
        source: formValue.source || undefined
      };

      const request = this.isEditMode && this.candidatureId
        ? this.candidatureService.updateCandidature(this.candidatureId, candidature)
        : this.candidatureService.createCandidature(candidature);

      request
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            const message = this.isEditMode
              ? 'Candidature modifiée avec succès'
              : 'Candidature ajoutée avec succès';
            this.notificationService.success(message);
            this.router.navigate(['/candidatures']);
          },
          error: (error) => {
            console.error('❌ Erreur lors de l\'enregistrement:', error);
            const errorMessage = this.isEditMode
              ? 'Erreur lors de la modification de la candidature'
              : 'Erreur lors de l\'ajout de la candidature';
            this.notificationService.error(errorMessage);
            this.isLoading = false;
          }
        });
    } else {
      Object.keys(this.candidatureForm.controls).forEach(key => {
        this.candidatureForm.get(key)?.markAsTouched();
      });
      this.notificationService.warning('Veuillez remplir tous les champs obligatoires');
    }
  }

  private getFormErrors(): Record<string, unknown> {
    const errors: Record<string, unknown> = {};
    Object.keys(this.candidatureForm.controls).forEach(key => {
      const control = this.candidatureForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  onCancel = (): void => {
    this.router.navigate(['/candidatures']);
  }
}