export type SyncRunTriggerType = 'Manual' | 'Scheduled';

export type SyncRunStatus =
  | 'Pending'
  | 'Running'
  | 'Completed'
  | 'CompletedWithIssues'
  | 'Interrupted'
  | 'Failed';

export type SyncRunItemStatus = 'Pending' | 'Running' | 'Succeeded' | 'Skipped' | 'Failed';

export interface SyncRun {
  id: number;
  triggerType: SyncRunTriggerType;
  status: SyncRunStatus;
  totalCount: number;
  successCount: number;
  skippedCount: number;
  failedCount: number;
  processedCount: number;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface SyncRunItem {
  id: number;
  syncRunId: number;
  channelId: number;
  channelName: string;
  status: SyncRunItemStatus | null;
  errorCode: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

export interface SyncRunItemsFilter {
  runId: number | null;
  status?: SyncRunItemStatus;
  preview?: SyncRunPreviewName | null;
}

export type SyncRunPreviewName = 'running' | 'completed-with-issues' | 'interrupted' | 'failed';

export const ACTIVE_SYNC_RUN_STATUSES: readonly SyncRunStatus[] = ['Pending', 'Running'];

export const SYNC_RUN_STATUS_LABELS: Record<SyncRunStatus, string> = {
  Pending: 'Queued',
  Running: 'Syncing',
  Completed: 'Completed',
  CompletedWithIssues: 'Completed with issues',
  Interrupted: 'Interrupted',
  Failed: 'Failed',
};

export const SYNC_RUN_ITEM_STATUS_LABELS: Record<SyncRunItemStatus, string> = {
  Pending: 'Pending',
  Running: 'Running',
  Succeeded: 'Successful',
  Skipped: 'Skipped',
  Failed: 'Failed',
};

export function isActiveSyncRun(status: SyncRunStatus): boolean {
  return ACTIVE_SYNC_RUN_STATUSES.includes(status);
}

export function getSyncRunProgress(run: SyncRun): number {
  if (run.totalCount <= 0) return 0;
  return Math.min(100, Math.max(0, (run.processedCount / run.totalCount) * 100));
}

export function formatSyncRunDuration(startedAt: string | null, completedAt: string | null): string {
  if (!startedAt || !completedAt) return '—';

  const durationMs = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  if (!Number.isFinite(durationMs) || durationMs < 0) return '—';

  const totalSeconds = Math.floor(durationMs / 1_000);
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
