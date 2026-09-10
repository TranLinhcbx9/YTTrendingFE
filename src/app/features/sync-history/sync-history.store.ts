import { computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { EMPTY, of } from 'rxjs';

import { toProblemDetails } from '@core/http/problem-details';
import { withMutationState } from '@shared/store/with-mutation-state';
import { withPagedResource } from '@shared/store/with-paged-resource';
import { getPreviewItemsPage, getSyncRunPreview } from './sync-history.fixtures';
import {
  getSyncRunProgress,
  isActiveSyncRun,
  SyncRunItem,
  SyncRunItemsFilter,
  SyncRunPreviewName,
} from './sync-history.models';
import { SyncHistoryService } from './sync-history.service';

interface SyncHistoryState {
  runId: number | null;
  preview: SyncRunPreviewName | null;
  selectedFailure: SyncRunItem | null;
  isPolling: boolean;
}

/** State cho cả Sync history launcher và Sync run detail. */
export const SyncHistoryStore = signalStore(
  { providedIn: 'root' },
  withState<SyncHistoryState>({
    runId: null,
    preview: null,
    selectedFailure: null,
    isPolling: false,
  }),
  withPagedResource<SyncRunItem, SyncRunItemsFilter>(
    () => {
      const service = inject(SyncHistoryService);
      return (params) => {
        if (params.runId == null) return EMPTY;
        if (params.preview) {
          return of(getPreviewItemsPage(params.preview, params.page, params.pageSize, params.status));
        }
        return service.getSyncRunItems({
          runId: params.runId,
          page: params.page,
          pageSize: params.pageSize,
          status: params.status,
        });
      };
    },
    { runId: null, preview: null },
  ),
  withMutationState(),
  withProps(() => ({
    _syncHistoryService: inject(SyncHistoryService),
  })),
  withProps((store) => ({
    _summaryResource: rxResource({
      params: () => ({ runId: store.runId(), preview: store.preview() }),
      stream: ({ params }) => {
        if (params.runId == null) return EMPTY;
        if (params.preview) return of(getSyncRunPreview(params.preview).run);
        return store._syncHistoryService.getSyncRun(params.runId);
      },
    }),
  })),
  withComputed((store) => ({
    syncRun: computed(() => store._summaryResource.value()),
    summaryError: computed(() => toProblemDetails(store._summaryResource.error())),
    isSummaryLoading: computed(() => store._summaryResource.isLoading()),
    isActiveRun: computed(() => {
      const run = store._summaryResource.value();
      return run != null && isActiveSyncRun(run.status);
    }),
    progress: computed(() => {
      const run = store._summaryResource.value();
      return run ? getSyncRunProgress(run) : 0;
    }),
  })),
  withMethods((store) => {
    let pollingTimer: number | null = null;

    const stopPolling = (): void => {
      if (pollingTimer != null) {
        window.clearInterval(pollingTimer);
        pollingTimer = null;
      }
      if (store.isPolling()) {
        patchState(store, { isPolling: false });
      }
    };

    const refreshRun = (): void => {
      store._summaryResource.reload();
      // Khi bảng đang lỗi, không lặp lại request lỗi mỗi 3 giây. User dùng Retry
      // riêng của bảng để mở lại item polling sau khi kết nối trở lại.
      if (!store.loadError()) {
        store.reload();
      }
    };

    const startPolling = (): void => {
      if (store.preview() || store.runId() == null || pollingTimer != null) return;

      patchState(store, { isPolling: true });
      pollingTimer = window.setInterval(() => {
        const run = store.syncRun();
        if (store.summaryError()) {
          stopPolling();
          return;
        }
        if (run && !isActiveSyncRun(run.status)) {
          // A summary refresh and its matching item request can resolve in either
          // order. Reload once more after the terminal status is visible so the
          // table cannot remain on an earlier, in-progress snapshot.
          if (!store.loadError()) {
            store.reload();
          }
          stopPolling();
          return;
        }
        refreshRun();
      }, 3_000);
    };

    return {
      async createSyncRun() {
        return store.runActionMutationResult(() => store._syncHistoryService.createSyncRun());
      },

      openRun(runId: number, preview: SyncRunPreviewName | null): void {
        const needsSummaryReload = store.runId() === runId && store.preview() === preview;
        stopPolling();
        patchState(store, { runId, preview, selectedFailure: null });
        store.setFilter({ runId, preview, status: undefined });
        if (needsSummaryReload) {
          store._summaryResource.reload();
        }
      },

      setItemStatus(status: SyncRunItemsFilter['status']): void {
        store.setFilter({ status });
      },

      retrySummary(): void {
        if (store.runId() == null) return;
        store._summaryResource.reload();
        startPolling();
      },

      retryItems(): void {
        store.reload();
      },

      refreshRun,
      startPolling,
      stopPolling,

      selectFailure(item: SyncRunItem): void {
        patchState(store, { selectedFailure: item });
      },

      clearSelectedFailure(): void {
        patchState(store, { selectedFailure: null });
      },
    };
  }),
);
