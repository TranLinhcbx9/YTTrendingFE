import { PagedResult } from '@shared/models/paged-result';
import {
  SyncRun,
  SyncRunItem,
  SyncRunItemStatus,
  SyncRunPreviewName,
} from './sync-history.models';

interface SyncRunPreview {
  run: SyncRun;
  items: SyncRunItem[];
}

const previewItems: SyncRunItem[] = [
  {
    id: 1,
    syncRunId: 9001,
    channelId: 101,
    channelName: 'Daily Shorts News',
    status: 'Succeeded',
    errorCode: null,
    errorMessage: null,
    startedAt: '2026-09-08T02:03:00Z',
    completedAt: '2026-09-08T02:03:18Z',
  },
  {
    id: 2,
    syncRunId: 9001,
    channelId: 102,
    channelName: 'Startup Clips',
    status: 'Skipped',
    errorCode: 'channel.unavailable',
    errorMessage: 'Channel was unavailable during this run.',
    startedAt: null,
    completedAt: null,
  },
  {
    id: 3,
    syncRunId: 9001,
    channelId: 103,
    channelName: 'Creator Lab',
    status: 'Failed',
    errorCode: 'youtube.quotaExceeded',
    errorMessage: 'YouTube API quota has been exhausted. Please try again after the quota resets.',
    startedAt: '2026-09-08T02:03:00Z',
    completedAt: '2026-09-08T02:03:31Z',
  },
  {
    id: 4,
    syncRunId: 9001,
    channelId: 104,
    channelName: 'Mindset Minutes',
    status: 'Succeeded',
    errorCode: null,
    errorMessage: null,
    startedAt: '2026-09-08T02:03:00Z',
    completedAt: '2026-09-08T02:03:12Z',
  },
];

const previews: Record<SyncRunPreviewName, SyncRunPreview> = {
  running: {
    run: {
      id: 9001,
      triggerType: 'Manual',
      status: 'Running',
      totalCount: 20,
      successCount: 12,
      skippedCount: 0,
      failedCount: 0,
      processedCount: 12,
      errorCode: null,
      errorMessage: null,
      createdAt: '2026-09-08T02:03:00Z',
      startedAt: '2026-09-08T02:03:05Z',
      completedAt: null,
    },
    items: previewItems.map((item) =>
      item.id === 3
        ? { ...item, status: 'Running', errorCode: null, errorMessage: null, completedAt: null }
        : item,
    ),
  },
  'completed-with-issues': {
    run: {
      id: 9001,
      triggerType: 'Manual',
      status: 'CompletedWithIssues',
      totalCount: 18,
      successCount: 16,
      skippedCount: 1,
      failedCount: 1,
      processedCount: 18,
      errorCode: null,
      errorMessage: null,
      createdAt: '2026-09-08T02:03:00Z',
      startedAt: '2026-09-08T02:03:05Z',
      completedAt: '2026-09-08T02:04:38Z',
    },
    items: previewItems,
  },
  interrupted: {
    run: {
      id: 9001,
      triggerType: 'Scheduled',
      status: 'Interrupted',
      totalCount: 18,
      successCount: 8,
      skippedCount: 0,
      failedCount: 0,
      processedCount: 8,
      errorCode: 'syncRun.interrupted',
      errorMessage: 'The sync run was interrupted before all channels were processed.',
      createdAt: '2026-09-07T14:00:00Z',
      startedAt: '2026-09-07T14:00:04Z',
      completedAt: '2026-09-07T14:01:02Z',
    },
    items: previewItems.map((item) =>
      item.id > 2 ? { ...item, status: 'Pending', errorCode: null, errorMessage: null } : item,
    ),
  },
  failed: {
    run: {
      id: 9001,
      triggerType: 'Manual',
      status: 'Failed',
      totalCount: 18,
      successCount: 0,
      skippedCount: 0,
      failedCount: 0,
      processedCount: 0,
      errorCode: 'youtube.serviceUnavailable',
      errorMessage: 'The YouTube service could not be reached. Please try again.',
      createdAt: '2026-09-08T02:03:00Z',
      startedAt: '2026-09-08T02:03:05Z',
      completedAt: '2026-09-08T02:03:08Z',
    },
    items: previewItems.map((item) => ({
      ...item,
      status: 'Pending',
      errorCode: null,
      errorMessage: null,
      startedAt: null,
      completedAt: null,
    })),
  },
};

export function isSyncRunPreviewName(value: string | null): value is SyncRunPreviewName {
  return value != null && value in previews;
}

export function getSyncRunPreview(name: SyncRunPreviewName): SyncRunPreview {
  return previews[name];
}

export function getPreviewItemsPage(
  name: SyncRunPreviewName,
  page: number,
  pageSize: number,
  status?: SyncRunItemStatus,
): PagedResult<SyncRunItem> {
  const items = getSyncRunPreview(name).items.filter((item) => !status || item.status === status);
  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNext: page < totalPages,
  };
}
