import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { ChannelAvatar } from '@shared/ui/channel-avatar/channel-avatar';
import { environment } from '@env/environment';
import { isSyncRunPreviewName } from '../sync-history.fixtures';
import { formatSyncRunDuration, SyncRunItem, SyncRunItemStatus } from '../sync-history.models';
import { SyncHistoryStore } from '../sync-history.store';
import { SyncRunFailureDetails } from '../sync-run-failure-details/sync-run-failure-details';
import { SyncStatusChip } from '../sync-status-chip/sync-status-chip';

interface StatusFilterOption {
  label: string;
  value: SyncRunItemStatus | undefined;
}

@Component({
  selector: 'app-sync-run-detail-page',
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    MatBottomSheetModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    ChannelAvatar,
    EmptyState,
    SyncStatusChip,
    SyncRunFailureDetails,
  ],
  templateUrl: './sync-run-detail.html',
  styleUrl: './sync-run-detail.css',
})
export class SyncRunDetail implements OnInit, OnDestroy {
  protected readonly store = inject(SyncHistoryStore);
  private readonly route = inject(ActivatedRoute);
  private readonly bottomSheet = inject(MatBottomSheet);

  protected readonly invalidRunId = signal(false);
  protected readonly statusFilters: readonly StatusFilterOption[] = [
    { label: 'All', value: undefined },
    { label: 'Pending', value: 'Pending' },
    { label: 'Running', value: 'Running' },
    { label: 'Successful', value: 'Succeeded' },
    { label: 'Skipped', value: 'Skipped' },
    { label: 'Failed', value: 'Failed' },
  ];

  ngOnInit(): void {
    const runId = Number(this.route.snapshot.paramMap.get('runId'));
    if (!Number.isSafeInteger(runId) || runId <= 0) {
      this.invalidRunId.set(true);
      return;
    }

    const previewParam = environment.production ? null : this.route.snapshot.queryParamMap.get('preview');
    const preview = isSyncRunPreviewName(previewParam) ? previewParam : null;

    this.store.openRun(runId, preview);
    this.store.startPolling();
  }

  ngOnDestroy(): void {
    this.store.stopPolling();
    this.store.clearSelectedFailure();
  }

  protected onPageChange(event: PageEvent): void {
    this.store.setPage(event.pageIndex + 1);
  }

  protected setStatus(status: SyncRunItemStatus | undefined): void {
    this.store.setItemStatus(status);
  }

  protected formatDuration(startedAt: string | null, completedAt: string | null): string {
    return formatSyncRunDuration(startedAt, completedAt);
  }

  protected openFailureDetails(item: SyncRunItem): void {
    if (window.matchMedia('(min-width: 900px)').matches) {
      this.store.selectFailure(item);
      return;
    }

    this.bottomSheet.open(SyncRunFailureDetails, {
      ariaLabel: `Failure details for ${item.channelName}`,
      data: item,
      panelClass: 'sync-run-failure-sheet',
    });
  }

  protected errorTitle(): string {
    return this.store.summaryError()?.code === 'syncRun.notFound'
      ? 'Sync run not found'
      : 'Could not load this sync run';
  }

  protected errorMessage(): string {
    const error = this.store.summaryError();
    if (error?.code === 'syncRun.notFound') {
      return 'This sync run no longer exists, or the link is out of date.';
    }
    return error?.detail ?? 'Please check your connection and try again.';
  }
}
