import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { ProblemDetails } from '@core/http/problem-details';

/** Shared snackbar position for the whole app — every notification must go through this service. */
const BASE_CONFIG: MatSnackBarConfig = {
  horizontalPosition: 'end',
  verticalPosition: 'bottom',
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  /** Keeps the default M3 color (inverse-surface) — see note in `styles/tokens.css`. */
  success(message: string): void {
    this.snackBar.open(message, 'Dismiss', { ...BASE_CONFIG, duration: 4000 });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      ...BASE_CONFIG,
      duration: 6000,
      panelClass: 'app-snackbar-error',
    });
  }

  /**
   * Reports an error for a failed write command.
   *
   * Field-level 400 errors (`errors.<field>`) are already shown inline under
   * the field per the error table in `docs/architecture.md` — skipped here to
   * avoid reporting twice. 404/5xx are also skipped since `errorInterceptor`
   * already fires a snackbar for those. Only the rest (409, network loss) push
   * a snackbar here.
   */
  mutationError(problem: ProblemDetails | null | undefined, fallback: string): void {
    if (problem?.errors) return;
    if (problem && (problem.status === 404 || problem.status >= 500)) return;
    this.error(problem?.detail ?? problem?.title ?? fallback);
  }
}
