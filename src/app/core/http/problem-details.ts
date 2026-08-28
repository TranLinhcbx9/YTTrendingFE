import { HttpErrorResponse } from '@angular/common/http';

export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  code: string;
  errors?: Record<string, string[]>;
}

/**
 * Bóc `ProblemDetails` từ lỗi bất kỳ (`rxResource().error()`, `catch (err)`).
 *
 * `HttpErrorResponse.error` chỉ là `ProblemDetails` khi backend thật sự trả
 * body theo Result pattern. Mất mạng / CORS chặn / server không phản hồi thì
 * nó là `ProgressEvent` và `status` = 0 — cast thẳng sẽ ra object rỗng khiến
 * UI im lặng không báo gì, nên các case đó fallback về ProblemDetails tự dựng.
 */
export function toProblemDetails(err: unknown): ProblemDetails | undefined {
  if (err == null) return undefined;

  if (err instanceof HttpErrorResponse) {
    const body = err.error as Partial<ProblemDetails> | null;
    if (body && typeof body === 'object' && typeof body.code === 'string') {
      return body as ProblemDetails;
    }
    return err.status === 0
      ? { status: 0, title: 'Mất kết nối', detail: 'Không kết nối được máy chủ, vui lòng thử lại.', code: 'network.error' }
      : { status: err.status, title: err.statusText || 'Lỗi', detail: 'Đã có lỗi xảy ra, vui lòng thử lại.', code: 'server.error' };
  }

  return { status: 0, title: 'Lỗi', detail: 'Đã có lỗi xảy ra, vui lòng thử lại.', code: 'unknown.error' };
}
