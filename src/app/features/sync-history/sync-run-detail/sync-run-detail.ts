import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';

import { NotificationService } from '@core/ui/notification.service';
import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { ChannelAvatar } from '@shared/ui/channel-avatar/channel-avatar';
import { environment } from '@env/environment';
import { isSyncRunPreviewName } from '../sync-history.fixtures';
import {
  formatSyncRunDuration,
  SyncRunItem,
  SyncRunItemStatus,
  SyncRunStatus,
} from '../sync-history.models';
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
    MatProgressSpinnerModule,
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
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private routeSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.openRunFromRoute(params.get('runId'));
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.store.stopPolling();
    this.store.clearSelectedFailure();
  }

  protected async startNewSync(): Promise<void> {
    const run = await this.store.createSyncRun();
    if (run) {
      await this.router.navigate(['/sync-history', run.id]);
      return;
    }

    const error = this.store.actionError();
    if (error?.code !== 'syncRun.inProgress' && error?.code !== 'syncRun.noEnabledChannels') {
      this.notification.mutationError(error, 'Could not start sync.');
    }
  }

  protected outcomeIcon(status: SyncRunStatus): string {
    switch (status) {
      case 'Completed':
        return 'check_circle';
      case 'CompletedWithIssues':
        return 'warning';
      default:
        return 'error';
    }
  }

  protected outcomeTitle(status: SyncRunStatus): string {
    switch (status) {
      case 'Completed':
        return 'This sync completed successfully.';
      case 'CompletedWithIssues':
        return 'This sync completed with issues.';
      case 'Interrupted':
        return 'This sync was interrupted.';
      case 'Failed':
        return 'This sync did not complete successfully.';
      default:
        return 'This sync is no longer active.';
    }
  }

  protected outcomeTone(status: SyncRunStatus): string {
    switch (status) {
      case 'Completed':
        return 'var(--color-sync-success)';
      case 'Interrupted':
      case 'Failed':
        return 'var(--color-danger)';
      default:
        return 'var(--color-sync-issues)';
    }
  }

  protected outcomeBackground(status: SyncRunStatus): string | null {
    return status === 'Interrupted' || status === 'Failed'
      ? 'var(--mat-sys-error-container)'
      : null;
  }

  private openRunFromRoute(runIdParam: string | null): void {
    const runId = Number(runIdParam);
    if (!Number.isSafeInteger(runId) || runId <= 0) {
      this.store.stopPolling();
      this.store.clearSelectedFailure();
      this.invalidRunId.set(true);
      return;
    }

    this.invalidRunId.set(false);
    const previewParam = environment.production ? null : this.route.snapshot.queryParamMap.get('preview');
    const preview = isSyncRunPreviewName(previewParam) ? previewParam : null;

    this.store.openRun(runId, preview);
    this.store.startPolling();
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
