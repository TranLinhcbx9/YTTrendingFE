import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '@core/ui/notification.service';
import { ProblemDetails } from './problem-details';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const problem = error.error as ProblemDetails | undefined;
        if (error.status === 404 || error.status >= 500) {
          const message =
            problem?.detail ?? problem?.title ?? 'Something went wrong, please try again.';
          notification.error(message);
        }
        // 400 (validation) & 409 (conflict): no snackbar — component reads
        // problem.errors / problem.detail itself to show the error inline
      }
      return throwError(() => error);
    }),
  );
};
