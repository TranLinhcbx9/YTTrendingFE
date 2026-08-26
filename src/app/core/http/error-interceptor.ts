import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { ProblemDetails } from './problem-details';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const problem = error.error as ProblemDetails | undefined;
        if (error.status === 404 || error.status >= 500) {
          messageService.add({
            severity: 'error',
            summary: problem?.title ?? 'Lỗi',
            detail: problem?.detail ?? 'Đã có lỗi xảy ra, vui lòng thử lại.',
          });
        }
        // 400 (validation) & 409 (conflict): không toast — component tự đọc
        // problem.errors / problem.detail để hiện lỗi inline
      }
      return throwError(() => error);
    }),
  );
};
