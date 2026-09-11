import { computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { EMPTY, of } from 'rxjs';

import { toProblemDetails } from '@core/http/problem-details';
import { withMutationState } from '@shared/store/with-mutation-state';
import { withPagedResource } from '@shared/store/with-paged-resource';
import { getPreviewItemsPage, getSyncRunPreview } from './sync-history.fixtures';
import {
  getSyncRunProgress,
  isActiveSyncRun,
  SyncRun,
  SyncRunItem,
  SyncRunItemStatus,
  SyncRunPreviewName,
  SyncRunsFilter,
} from './sync-history.models';
import { SyncHistoryService } from './sync-history.service';

interface SyncHistoryState {
  runId: number | null;
  preview: SyncRunPreviewName | null;
  itemPage: number;
  itemStatus: SyncRunItemStatus | undefined;
  selectedFailure: SyncRunItem | null;
  isPolling: boolean;
}

/** State cho trang Sync history và trang chi tiết một SyncRun. */
export const SyncHistoryStore = signalStore(
  { providedIn: 'root' },
  withState<SyncHistoryState>({
    runId: null,
    preview: null,
    itemPage: 1,
    itemStatus: undefined,
    selectedFailure: null,
    isPolling: false,
  }),
  withPagedResource<SyncRun, SyncRunsFilter>(() => {
    const service = inject(SyncHistoryService);
    return (params) => service.getSyncRuns(params);
  }, {}),
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
    _itemsResource: rxResource({
      params: () => ({
        runId: store.runId(),
        preview: store.preview(),
        page: store.itemPage(),
        pageSize: store.pageSize(),
        status: store.itemStatus(),
      }),
      stream: ({ params }) => {
        const runId = params.runId;
        if (runId == null) return EMPTY;
        if (params.preview) {
          return of(
            getPreviewItemsPage(params.preview, params.page, params.pageSize, params.status),
          );
        }
        return store._syncHistoryService.getSyncRunItems({
          runId,
          page: params.page,
          pageSize: params.pageSize,
          status: params.status,
        });
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
    syncRunItems: computed(() => store._itemsResource.value()?.items ?? []),
    syncRunItemsTotalCount: computed(() => store._itemsResource.value()?.totalCount ?? 0),
    isSyncRunItemsLoading: computed(() => store._itemsResource.isLoading()),
    syncRunItemsError: computed(() => toProblemDetails(store._itemsResource.error())),
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
      if (!store.syncRunItemsError()) {
        store._itemsResource.reload();
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
          // One final request makes the item table and history list match the
          // terminal summary, regardless of which response resolved first.
          if (!store.syncRunItemsError()) {
            store._itemsResource.reload();
          }
          store.resetToFirstPage();
          stopPolling();
          return;
        }
        refreshRun();
      }, 3_000);
    };

    return {
      async createSyncRun(): Promise<SyncRun | null> {
        const run = await store.runActionMutationResult(() =>
          store._syncHistoryService.createSyncRun(),
        );
        if (run) {
          store.resetToFirstPage();
        }
        return run;
      },

      setHistoryFilters(filter: SyncRunsFilter): void {
        store.replaceFilter(filter);
      },

      openRun(runId: number, preview: SyncRunPreviewName | null): void {
        const needsReload = store.runId() === runId && store.preview() === preview;
        stopPolling();
        patchState(store, {
          runId,
          preview,
          itemPage: 1,
          itemStatus: undefined,
          selectedFailure: null,
        });
        if (needsReload) {
          store._summaryResource.reload();
          store._itemsResource.reload();
        }
      },

      setItemPage(page: number): void {
        patchState(store, { itemPage: page });
      },

      setItemStatus(status: SyncRunItemStatus | undefined): void {
        patchState(store, { itemStatus: status, itemPage: 1 });
      },

      retrySummary(): void {
        if (store.runId() == null) return;
        store._summaryResource.reload();
        startPolling();
      },

      retryItems(): void {
        store._itemsResource.reload();
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
