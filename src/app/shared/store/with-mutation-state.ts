import { computed } from '@angular/core';
import { patchState, signalStoreFeature, withComputed, withMethods, withState } from '@ngrx/signals';

import { ProblemDetails, toProblemDetails } from '@core/http/problem-details';

export interface MutationState {
  isSubmitting: boolean;
  formError: ProblemDetails | null;
  isActionRunning: boolean;
  actionError: ProblemDetails | null;
}

/**
 * Trạng thái busy + lỗi cho các lệnh ghi (create/update/delete), thay cho việc
 * mỗi method tự viết `try/catch` + `patchState` rồi cast lỗi tay.
 *
 * Hai làn tách riêng theo đúng bảng lỗi ở `docs/architecture.md`:
 * - **form** (`isSubmitting`/`formError`) — lệnh phát từ 1 form, lỗi 400 gắn
 *   với field cụ thể (`errors.<field>`) nên hiện inline dưới field đó.
 * - **action** (`isActionRunning`/`actionError`) — lệnh phát từ 1 nút hành động
 *   (xoá, toggle), lỗi không gắn field nào nên hiện inline tại chỗ hành động.
 *
 * Tách 2 làn để 1 nút xoá đang chạy không làm form Add bị disable lây.
 *
 * Trả `boolean` (không phải giá trị API trả) để caller `if (ok)` được kể cả
 * với lệnh trả `void` như DELETE 204.
 */
export function withMutationState() {
  return signalStoreFeature(
    withState<MutationState>({
      isSubmitting: false,
      formError: null,
      isActionRunning: false,
      actionError: null,
    }),
    withComputed((store) => ({
      /**
       * Lỗi form **không** gắn field nào (409 trùng dữ liệu, mất kết nối) — hiện
       * 1 dòng chung cuối form. Lỗi field-level đã có `errors.<field>` hiện dưới
       * đúng field, còn 404/5xx thì `errorInterceptor` đã bắn snackbar rồi.
       */
      formErrorMessage: computed(() => {
        const err = store.formError();
        if (!err || err.errors) return null;
        if (err.status === 404 || err.status >= 500) return null;
        return err.detail ?? err.title;
      }),
    })),
    withMethods((store) => ({
      /** Chạy lệnh ghi phát từ form — lỗi vào `formError`. */
      async runFormMutation(operation: () => Promise<unknown>): Promise<boolean> {
        patchState(store, { isSubmitting: true, formError: null });
        try {
          await operation();
          patchState(store, { isSubmitting: false });
          return true;
        } catch (err) {
          patchState(store, { isSubmitting: false, formError: toProblemDetails(err) ?? null });
          return false;
        }
      },

      /** Chạy lệnh ghi phát từ nút hành động — lỗi vào `actionError`. */
      async runActionMutation(operation: () => Promise<unknown>): Promise<boolean> {
        patchState(store, { isActionRunning: true, actionError: null });
        try {
          await operation();
          patchState(store, { isActionRunning: false });
          return true;
        } catch (err) {
          patchState(store, { isActionRunning: false, actionError: toProblemDetails(err) ?? null });
          return false;
        }
      },
    })),
  );
}
