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
 * Extracts `ProblemDetails` from any error (`rxResource().error()`, `catch (err)`).
 *
 * `HttpErrorResponse.error` is only a `ProblemDetails` when the backend
 * actually returns a body following the Result pattern. On network loss /
 * CORS block / no server response it's a `ProgressEvent` with `status` = 0 —
 * casting directly would yield an empty object and the UI would silently show
 * nothing, so those cases fall back to a hand-built ProblemDetails.
 */
export function toProblemDetails(err: unknown): ProblemDetails | undefined {
  if (err == null) return undefined;

  if (err instanceof HttpErrorResponse) {
    const body = err.error as Partial<ProblemDetails> | null;
    if (body && typeof body === 'object' && typeof body.code === 'string') {
      return body as ProblemDetails;
    }
    return err.status === 0
      ? { status: 0, title: 'Connection lost', detail: 'Could not reach the server, please try again.', code: 'network.error' }
      : { status: err.status, title: err.statusText || 'Error', detail: 'Something went wrong, please try again.', code: 'server.error' };
  }

  return { status: 0, title: 'Error', detail: 'Something went wrong, please try again.', code: 'unknown.error' };
}
