import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

import { ProblemDetails } from './problem-details';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const problem = error.error as ProblemDetails | undefined;
        if (error.status === 404 || error.status >= 500) {
          const message =
            problem?.detail ?? problem?.title ?? 'Đã có lỗi xảy ra, vui lòng thử lại.';
          snackBar.open(message, 'Đóng', {
            duration: 6000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: 'app-snackbar-error',
          });
        }
        // 400 (validation) & 409 (conflict): không snackbar — component tự đọc
        // problem.errors / problem.detail để hiện lỗi inline
      }
      return throwError(() => error);
    }),
  );
};
