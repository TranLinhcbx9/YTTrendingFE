import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { NotificationService } from '@core/ui/notification.service';
import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { SyncRun, SyncRunStatus, SyncRunTriggerType, SyncRunsFilter } from './sync-history.models';
import { SyncHistoryStore } from './sync-history.store';
import { SyncStatusChip } from './sync-status-chip/sync-status-chip';

type HistoryTimeRange = 'default' | '1' | '7' | '30' | 'custom';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-sync-history-page',
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    EmptyState,
    SyncStatusChip,
  ],
  templateUrl: './sync-history.html',
  styleUrl: './sync-history.css',
})
export class SyncHistory {
  protected readonly store = inject(SyncHistoryStore);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  protected readonly status = signal<SyncRunStatus | undefined>(undefined);
  protected readonly source = signal<SyncRunTriggerType | undefined>(undefined);
  protected readonly timeRange = signal<HistoryTimeRange>('default');
  protected readonly today = new Date();
  protected readonly fromDate = signal<Date | null>(null);
  protected readonly toDate = signal<Date | null>(null);
  protected readonly dateRangeError = signal<string | null>(null);
  protected readonly displayedColumns = [
    'run',
    'status',
    'source',
    'started',
    'progress',
    'results',
    'actions',
  ];
  protected readonly trackByRunId = (_: number, run: SyncRun): number => run.id;

  protected readonly statusOptions: readonly SelectOption<SyncRunStatus>[] = [
    { label: 'Queued', value: 'Pending' },
    { label: 'Syncing', value: 'Running' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Completed with issues', value: 'CompletedWithIssues' },
    { label: 'Interrupted', value: 'Interrupted' },
    { label: 'Failed', value: 'Failed' },
  ];
  protected readonly sourceOptions: readonly SelectOption<SyncRunTriggerType>[] = [
    { label: 'Manual', value: 'Manual' },
    { label: 'Scheduled', value: 'Scheduled' },
  ];

  protected async startSync(): Promise<void> {
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

  protected onStatusSelection(value: SyncRunStatus | ''): void {
    this.status.set(value || undefined);
    this.applyFilters();
  }

  protected onSourceSelection(value: SyncRunTriggerType | ''): void {
    this.source.set(value || undefined);
    this.applyFilters();
  }

  protected onTimeRangeSelection(value: HistoryTimeRange): void {
    this.timeRange.set(value);
    this.applyFilters();
  }

  protected onDateChange(field: 'from' | 'to', value: Date | null): void {
    if (field === 'from') {
      this.fromDate.set(value);
    } else {
      this.toDate.set(value);
    }
    this.applyFilters();
  }

  protected clearFilters(): void {
    this.status.set(undefined);
    this.source.set(undefined);
    this.timeRange.set('default');
    this.fromDate.set(null);
    this.toDate.set(null);
    this.dateRangeError.set(null);
    this.store.setHistoryFilters({});
  }

  protected onPageChange(event: PageEvent): void {
    this.store.setPage(event.pageIndex + 1);
  }

  protected historyErrorTitle(): string {
    return this.store.loadError()?.code === 'validation.failed'
      ? 'Could not apply these filters'
      : 'Could not load sync history';
  }

  protected historyErrorMessage(): string {
    const error = this.store.loadError();
    return (
      error?.detail ??
      this.firstFieldError(error?.errors) ??
      'Please check your connection and try again.'
    );
  }

  private applyFilters(): void {
    const filter: SyncRunsFilter = {};
    const timeRange = this.timeRange();

    if (this.status()) filter.status = this.status();
    if (this.source()) filter.source = this.source();

    if (timeRange === 'custom') {
      const from = this.fromDate();
      const to = this.toDate();
      if (!from || !to) {
        this.dateRangeError.set('Choose both a start date and an end date.');
        return;
      }
      if (from > to) {
        this.dateRangeError.set('The start date must be on or before the end date.');
        return;
      }

      filter.from = `${this.toDateString(from)}T00:00:00.000Z`;
      filter.to = `${this.toDateString(to)}T23:59:59.999Z`;
    } else if (timeRange !== 'default') {
      filter.timeRangeInDays = Number(timeRange);
    }

    this.dateRangeError.set(null);
    this.store.setHistoryFilters(filter);
  }

  private firstFieldError(errors: Record<string, string[]> | undefined): string | null {
    return errors ? (Object.values(errors).flat()[0] ?? null) : null;
  }

  private toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
