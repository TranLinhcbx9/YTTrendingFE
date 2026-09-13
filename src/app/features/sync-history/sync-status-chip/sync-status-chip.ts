import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import {
  SYNC_RUN_ITEM_STATUS_LABELS,
  SYNC_RUN_STATUS_LABELS,
  SyncRunItemStatus,
  SyncRunStatus,
} from '../sync-history.models';

type SyncStatus = SyncRunStatus | SyncRunItemStatus | null;

@Component({
  selector: 'app-sync-status-chip',
  imports: [MatChipsModule, MatIconModule],
  template: `
    <mat-chip [class]="'sync-status-chip sync-status-chip--' + tone()" [disableRipple]="true">
      <mat-icon class="sync-status-chip__icon">{{ icon() }}</mat-icon>
      {{ label() }}
    </mat-chip>
  `,
  styleUrl: './sync-status-chip.css',
})
export class SyncStatusChip {
  readonly status = input.required<SyncStatus>();
  readonly scope = input.required<'run' | 'item'>();

  protected readonly label = computed(() => {
    const status = this.status();
    if (status == null) return 'Unknown status';
    return this.scope() === 'run'
      ? SYNC_RUN_STATUS_LABELS[status as SyncRunStatus] ?? 'Unknown status'
      : SYNC_RUN_ITEM_STATUS_LABELS[status as SyncRunItemStatus] ?? 'Unknown status';
  });

  protected readonly tone = computed(() => {
    switch (this.status()) {
      case 'Running':
        return 'running';
      case 'Completed':
      case 'Succeeded':
        return 'success';
      case 'CompletedWithIssues':
        return 'issues';
      case 'Failed':
      case 'Interrupted':
        return 'failed';
      case 'Skipped':
      case 'Pending':
      default:
        return 'pending';
    }
  });

  protected readonly icon = computed(() => {
    switch (this.status()) {
      case 'Running':
        return 'sync';
      case 'Completed':
      case 'Succeeded':
        return 'check_circle';
      case 'CompletedWithIssues':
        return 'warning';
      case 'Failed':
        return 'error';
      case 'Interrupted':
        return 'cancel';
      case 'Skipped':
        return 'skip_next';
      case 'Pending':
      default:
        return 'schedule';
    }
  });
}
