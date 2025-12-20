import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidature } from '@models/index';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';

@Component({
  selector: '[appCandidatureHero]',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureHeroComponent {
  @Input() candidature: Candidature | null = null;

  get companyInitial(): string {
    return this.candidature?.entreprise?.charAt(0) ?? '';
  }
}