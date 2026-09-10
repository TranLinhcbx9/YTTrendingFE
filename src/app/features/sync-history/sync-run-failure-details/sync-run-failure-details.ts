import { Component, computed, inject, input, output } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NotificationService } from '@core/ui/notification.service';
import { SyncRunItem } from '../sync-history.models';
import { SyncStatusChip } from '../sync-status-chip/sync-status-chip';

@Component({
  selector: 'app-sync-run-failure-details',
  imports: [MatButtonModule, MatIconModule, SyncStatusChip],
  templateUrl: './sync-run-failure-details.html',
  styleUrl: './sync-run-failure-details.css',
})
export class SyncRunFailureDetails {
  private readonly notification = inject(NotificationService);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<SyncRunFailureDetails>, {
    optional: true,
  });
  private readonly sheetData = inject<SyncRunItem | null>(MAT_BOTTOM_SHEET_DATA, { optional: true });

  readonly item = input<SyncRunItem | null>(this.sheetData);
  readonly dismissed = output<void>();

  protected readonly isBottomSheet = computed(() => this.bottomSheetRef != null);

  protected dismiss(): void {
    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
      return;
    }
    this.dismissed.emit();
  }

  protected async copyErrorCode(errorCode: string | null): Promise<void> {
    if (!errorCode) return;

    try {
      if (!navigator.clipboard) throw new Error('Clipboard API is unavailable');
      await navigator.clipboard.writeText(errorCode);
      this.notification.success('Error code copied');
    } catch {
      this.notification.error('Could not copy the error code.');
    }
  }
}
