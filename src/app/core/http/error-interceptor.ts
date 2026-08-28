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
            problem?.detail ?? problem?.title ?? 'Đã có lỗi xảy ra, vui lòng thử lại.';
          notification.error(message);
        }
        // 400 (validation) & 409 (conflict): không snackbar — component tự đọc
        // problem.errors / problem.detail để hiện lỗi inline
      }
      return throwError(() => error);
    }),
  );
};
