import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, ConfirmationConfig } from '@services/confirmation.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationModalComponent {
  confirmationService = inject(ConfirmationService);

  get config(): ConfirmationConfig | null {
    return this.confirmationService.currentConfig();
  }

  get showModal(): boolean {
    return this.confirmationService.showModal();
  }

  onConfirm(): void {
    this.confirmationService.onConfirm();
  }

  onCancel(): void {
    this.confirmationService.onCancel();
  }
}
