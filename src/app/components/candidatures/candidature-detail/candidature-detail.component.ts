import { Component, OnInit, inject, signal, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { CandidatureService, NotificationService, ConfirmationService } from '@services/index';
import { Candidature } from '@models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorCardComponent } from '@shared/components/error-card/error-card.component';
import { CandidatureHeroComponent } from './components/hero/hero.component';
import { CandidatureTimelineComponent } from './components/timeline/timeline.component';
import { CandidatureInfoComponent } from './components/info/info.component';
import { CandidatureContactComponent } from './components/contact/contact.component';
import { CandidatureActionsComponent } from './components/actions/actions.component';
import { copyToClipboard, getHttpErrorMessage, CANDIDATURE_ERROR_MESSAGES } from '@core/utils';

@Component({
  selector: 'app-candidature-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    ErrorCardComponent,
    CandidatureHeroComponent,
    CandidatureTimelineComponent,
    CandidatureInfoComponent,
    CandidatureContactComponent,
    CandidatureActionsComponent
  ],
  templateUrl: './candidature-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureDetailComponent implements OnInit {
  private candidatureService = inject(CandidatureService);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  protected route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  candidature = signal<Candidature | null>(null);
  candidatureId = signal<number>(0);
  isLoading = signal(false);
  errorMessage = signal('');
  private loadingInProgress = false;

  // Note: utility helpers moved to child components; keep parent minimal.

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id && !isNaN(id)) {
      this.candidatureId.set(id);
      this.loadCandidature(id);
    } else {
      this.errorMessage.set('ID de candidature invalide');
    }
  }

  loadCandidature(id: number): void {
    if (this.loadingInProgress) {
      return;
    }

    this.loadingInProgress = true;
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.candidature.set(null);

    this.candidatureService.getCandidatureById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
          this.loadingInProgress = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.candidature.set(data);
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la candidature:', error);
          this.errorMessage.set(getHttpErrorMessage(error, CANDIDATURE_ERROR_MESSAGES, 'Erreur lors du chargement de la candidature.'));
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/candidatures']);
  }

  editCandidature(): void {
    const current = this.candidature();
    if (current) {
      this.router.navigate(['/candidatures', current.id, 'edit']);
    }
  }

  deleteCandidature(): void {
    const current = this.candidature();
    if (!current) return;

    this.confirmationService.confirmDelete(`${current.poste} chez ${current.entreprise}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (confirmed) {
          this.candidatureService.deleteCandidature(current.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.notificationService.success('Candidature supprimée avec succès');
                this.router.navigate(['/candidatures']);
              },
              error: (error) => {
                console.error('Erreur lors de la suppression:', error);
                this.notificationService.error('Erreur lors de la suppression de la candidature');
              }
            });
        }
      });
  }

  duplicateCandidature(): void {
    const current = this.candidature();
    if (!current) return;

    const duplicate = {
      entreprise: current.entreprise,
      poste: current.poste,
      localisation: current.localisation,
      dateCandidature: new Date(),
      statut: current.statut,
      source: current.source,
      description: current.description,
      lienOffre: current.lienOffre
    };

    this.candidatureService.createCandidature(duplicate)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (newCandidature) => {
          this.notificationService.success('Candidature dupliquée avec succès');
          this.router.navigate(['/candidatures', newCandidature.id]);
        },
        error: (error) => {
          console.error('Erreur lors de la duplication:', error);
          this.notificationService.error('Erreur lors de la duplication de la candidature');
        }
      });
  }

  shareCandidature(): void {
    const current = this.candidature();
    if (!current) return;

    const shareText = `Candidature - ${current.poste} chez ${current.entreprise}\nStatut: ${current.statut}`;

    if (navigator.share) {
      navigator.share({
        title: 'Partager la candidature',
        text: shareText,
        url: window.location.href
      }).catch(async () => {
        const result = await copyToClipboard(shareText);
        if (result.success) {
          this.notificationService.success('Copié dans le presse-papier');
        } else {
          this.notificationService.error('Erreur lors de la copie');
        }
      });
    } else {
      this.copyLink(shareText);
    }
  }

  async copyLink(link: string): Promise<void> {
    const result = await copyToClipboard(link);
    if (result.success) {
      this.notificationService.success('Copié dans le presse-papier');
    } else {
      this.notificationService.error('Erreur lors de la copie');
    }
  }
}
