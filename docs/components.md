# Shared Components

Nguồn thiết kế: Blueprint §02. Props viết theo cú pháp hàm mới
(`input()`/`output()`) — thêm component nào thì bổ sung 1 dòng vào bảng
tương ứng, không nhúng implementation vào docs.

## Dùng thẳng Angular Material — không tự viết

| Vai trò | Component | Ghi chú |
|---|---|---|
| Chip trạng thái | `mat-chip` | Bọc trong `StatusChip` bên dưới để giữ ngữ nghĩa |
| Thẻ video | `mat-card appearance="outlined"` | Nền của `VideoCard` |
| Bảng kênh | `mat-table` | Khai `matColumnDef` từng cột, density −2 |
| **Phân trang** | `mat-paginator` | Map thẳng `PagedResult<T>` qua `length`/`pageSize`/`pageIndex` |
| Bật/tắt kênh | `mat-slide-toggle` | `[checked]` + `(change)` → `MatSlideToggleChange.checked` |
| Ô nhập | `mat-form-field appearance="outline"` | `mat-error` lo lỗi 400 field-level |
| Nút | `<button matButton="filled\|tonal\|outlined\|text\|elevated">` | Mặc định là `text` |
| Thông báo | `MatSnackBar` | Service — không cần thẻ trong template |
| Dialog | `MatDialog` | Service — xem cảnh báo dưới |
| Tab Dashboard | `mat-tab-group` | Filter bar nằm **ngoài** tab group |
| Time Range | `mat-button-toggle-group` | Thay segmented control tự viết |

> **Dialog Material là service, không phải thẻ trong template.** Không có
> `[(visible)]`: cha gọi `dialog.open(Comp, {data})` rồi đọc
> `afterClosed()`; dialog nhận `MAT_DIALOG_DATA`, trả kết quả bằng
> `dialogRef.close(result)`.
>
> Material **không** có `ConfirmationService` sẵn — confirm dialog xoá kênh
> phải tự dựng 1 component nhỏ trên `MatDialog`, viết 1 lần dùng cả app.

## Tự viết — Material không có

| Component | Selector | Inputs | Outputs | Ghi chú |
|---|---|---|---|---|
| StatusChip | `app-status-chip` | `status = input.required<'New'\|'Tracking'\|'Archived'>()` | — | Bọc `mat-chip`; Archived tĩnh, Tracking có dot pulse (tắt dưới `prefers-reduced-motion`) |
| ScoreBadge | `app-score-badge` | `score = input<number \| null>()` | — | `null` → hiện `—` + tooltip "chờ đủ 2 lần đồng bộ", **không** hiện `0` |
| VideoCard | `app-video-card` | `video = input.required<VideoCardDto>()` | `bookmark = output<string>()` | Thumbnail 9:16, sparkline SVG tĩnh (không Chart.js — nhiều card cùng lúc) |
| EmptyState | `app-empty-state` | `icon`, `title`, `message = input<string>()` | — | Dùng chung cho mọi tab/màn hình rỗng |
| Sparkline | `app-sparkline` | `points = input.required<number[]>()` | — | SVG polyline thuần |
| NavRail | trong `layout/shell/` | — | — | Angular Material **không có** nav rail (chỉ có `mat-sidenav` là drawer) |

> `Pagination` tự viết đã **bỏ** — `mat-paginator` làm đúng việc đó.

## Quy tắc style khi dùng Material

1. **Utility Tailwind không đè được style Material** — `.mat-mdc-*` có
   specificity cao hơn. Đổi màu/bo góc/kích thước component Material thì
   đi qua `--mat-*` token của chính component đó (vd
   `--mat-chip-elevated-container-color`), hoặc `mat.theme-overrides()`
   cho token hệ thống. Tailwind chỉ dùng cho layout quanh component và
   markup tự viết.
2. **Component render trong CDK overlay** (dialog, snackbar, menu,
   tooltip, select) nằm ngoài cây DOM component → style phải đặt global,
   không đặt trong `styleUrl` của component.
3. Density đã set −2 toàn cục — không chỉnh chiều cao bằng tay.
