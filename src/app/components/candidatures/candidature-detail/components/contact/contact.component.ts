import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidature } from '@models/index';

@Component({
  selector: '[appCandidatureContact]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureContactComponent {
  @Input() candidature: Candidature | null = null;
  @Output() copyLink = new EventEmitter<string>();
}