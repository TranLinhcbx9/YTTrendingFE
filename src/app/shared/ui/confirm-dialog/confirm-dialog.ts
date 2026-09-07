import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Optional async command. The dialog closes only after it succeeds. */
  confirmAction?: () => Promise<boolean>;
  /** Hành động phá huỷ (xoá, không hoàn tác) — nút chính tô theo role error, khớp `.btn-danger` ở Blueprint §Snackbar & Dialog. */
  tone?: 'danger';
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialog, boolean>);
  protected readonly isSubmitting = signal(false);

  protected async confirm(): Promise<void> {
    if (!this.data.confirmAction) {
      this.dialogRef.close(true);
      return;
    }

    this.isSubmitting.set(true);
    try {
      if (await this.data.confirmAction()) this.dialogRef.close(true);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
