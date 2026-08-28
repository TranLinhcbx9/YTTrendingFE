import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { ProblemDetails } from '@core/http/problem-details';

/** Vị trí snackbar dùng chung toàn app — mọi thông báo phải qua service này. */
const BASE_CONFIG: MatSnackBarConfig = {
  horizontalPosition: 'end',
  verticalPosition: 'bottom',
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  /** Giữ màu default M3 (inverse-surface) — xem chú thích ở `styles/tokens.css`. */
  success(message: string): void {
    this.snackBar.open(message, 'Đóng', { ...BASE_CONFIG, duration: 4000 });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Đóng', {
      ...BASE_CONFIG,
      duration: 6000,
      panelClass: 'app-snackbar-error',
    });
  }

  /**
   * Báo lỗi cho 1 lệnh ghi thất bại.
   *
   * Lỗi 400 field-level (`errors.<field>`) đã hiện inline ngay dưới field theo
   * bảng lỗi ở `docs/architecture.md` — bỏ qua để không báo 2 lần. 404/5xx cũng
   * bỏ qua vì `errorInterceptor` đã bắn snackbar rồi. Còn lại (409, mất mạng)
   * mới đẩy snackbar ở đây.
   */
  mutationError(problem: ProblemDetails | null | undefined, fallback: string): void {
    if (problem?.errors) return;
    if (problem && (problem.status === 404 || problem.status >= 500)) return;
    this.error(problem?.detail ?? problem?.title ?? fallback);
  }
}
