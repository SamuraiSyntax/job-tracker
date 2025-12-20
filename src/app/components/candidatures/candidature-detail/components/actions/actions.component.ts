import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[appCandidatureActions]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatureActionsComponent {
  @Output() edit = new EventEmitter<void>();
  @Output() duplicate = new EventEmitter<void>();
  @Output() share = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}