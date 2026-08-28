import { computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { patchState, signalStoreFeature, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { Observable } from 'rxjs';

import { toProblemDetails } from '@core/http/problem-details';
import { PagedResult } from '@shared/models/paged-result';

/** Query param phân trang — khớp `PagedQuery` của backend (`docs/api-contract.md` §5). */
export interface PageParams {
  page: number;
  pageSize: number;
}

/** Backend default `pageSize` = 20, tự clamp > 100 về 100. */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * State + resource cho 1 danh sách phân trang `PagedResult<T>`.
 *
 * Mọi endpoint list của backend đều dùng chung `PagedQuery`/`PagedResult<T>`
 * (channels, videos, ...), nên phần page/pageSize → rxResource → items/
 * totalCount/loadError là y hệt nhau ở mọi feature. Gom 1 chỗ để các chi tiết
 * dễ sai chỉ phải đúng 1 lần: page **1-based** (mat-paginator `pageIndex`
 * 0-based), backend không trả `hasPrevious`, và reset trang sau khi thêm mới.
 *
 * `streamFactory` chạy trong injection context của store nên `inject()` được:
 *
 * ```ts
 * withPagedResource<Channel>(() => {
 *   const service = inject(ChannelsService);
 *   return (params) => service.getChannels(params);
 * })
 * ```
 */
export function withPagedResource<T>(streamFactory: () => (params: PageParams) => Observable<PagedResult<T>>) {
  return signalStoreFeature(
    withState({ page: 1, pageSize: DEFAULT_PAGE_SIZE }),
    withProps(() => ({
      _pagedStream: streamFactory(),
    })),
    withProps((store) => ({
      _pagedResource: rxResource({
        params: () => ({ page: store.page(), pageSize: store.pageSize() }),
        stream: ({ params }) => store._pagedStream(params),
      }),
    })),
    withComputed((store) => ({
      items: computed(() => store._pagedResource.value()?.items ?? []),
      totalCount: computed(() => store._pagedResource.value()?.totalCount ?? 0),
      totalPages: computed(() => store._pagedResource.value()?.totalPages ?? 0),
      hasNext: computed(() => store._pagedResource.value()?.hasNext ?? false),
      isLoading: computed(() => store._pagedResource.isLoading()),
      loadError: computed(() => toProblemDetails(store._pagedResource.error())),
    })),
    withMethods((store) => ({
      setPage(page: number): void {
        patchState(store, { page });
      },

      reload(): void {
        store._pagedResource.reload();
      },

      /**
       * Về trang đầu để thấy item vừa tạo — fetch đúng 1 lần: đang ở trang khác
       * thì `params` đổi, `rxResource` tự fetch; đang ở trang 1 thì `params`
       * không đổi nên phải `reload()` tay.
       */
      resetToFirstPage(): void {
        const alreadyOnFirstPage = store.page() === 1;
        patchState(store, { page: 1 });
        if (alreadyOnFirstPage) {
          store._pagedResource.reload();
        }
      },
    })),
  );
}
