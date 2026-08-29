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
| Tab Dashboard | `mat-tab-group` | Filter bar nằm **ngoài** tab group. 4 tab đúng mockup; 3 tab chưa có dữ liệu hiện `EmptyState` nêu rõ chờ gì |
| Time Range | `mat-button-toggle-group` | Thay segmented control tự viết. Đang `disabled` — `VideoFilter` backend chưa có param thời gian |
| Chip-search kênh | `mat-chip-grid` + `mat-autocomplete` trong `mat-form-field` | Ô "Kênh" của filter bar |
| Slider điểm | `mat-slider` (2 thumb) | Đang `disabled` — backend chưa có param điểm |

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
| ScoreBadge | `app-score-badge` | `score = input<number \| null>(null)` | — | `null` → hiện `—` + tooltip "chờ đủ 2 lần đồng bộ", **không** hiện `0`. Ngưỡng heat: <75 low, <86 mid, còn lại high |
| VideoCard | `app-video-card` | `video`, `score`, `trendPoints = input<number[]>([])`, `velocityPerHour`, `note`, `saved`, `bookmarkEnabled` | `bookmarkToggle = output<Video>()` | Đủ layout mockup. Dữ liệu ngoài `Video` truyền qua input riêng vì `VideoDto` chưa có — Recent Shorts để mặc định → badge `—`, footer "chờ dữ liệu", nút bookmark disabled |
| ChannelAvatar | `app-channel-avatar` | `name = input.required<string>()`, `size = input(18)` | — | Avatar tròn 2 chữ cái đầu; dùng ở bảng Channels + `VideoCard`. Đổi sang ảnh thật khi `ChannelDto` có field avatar |
| EmptyState | `app-empty-state` | `icon`, `title`, `message = input<string>()` | — | Dùng chung cho mọi tab/màn hình rỗng; `ng-content` để nhét nút hành động |
| Sparkline | `app-sparkline` | `points = input.required<number[]>()` | — | SVG polyline thuần 46×18, tự chuẩn hoá min/max — không Chart.js vì mỗi trang hàng chục card |
| NavRail | trong `layout/shell/` | — | — | Angular Material **không có** nav rail (chỉ có `mat-sidenav` là drawer) |
| ConfirmDialog | `app-confirm-dialog` | data qua `MAT_DIALOG_DATA`: `{ title, message, confirmLabel?, cancelLabel? }` | `dialogRef.close(true\|undefined)` | `shared/ui/confirm-dialog/` — 1 component dùng chung cho mọi hành động cần xác nhận (vd xoá kênh) |

> `Pagination` tự viết đã **bỏ** — `mat-paginator` làm đúng việc đó.

## Pipes dùng chung (`shared/pipes/`)

| Pipe | Input → Output | Ghi chú |
|---|---|---|
| `relativeTime` | `string \| null` (ISO) → `"2 giờ trước"` / `"Vừa xong"` / `"Chưa đồng bộ"` (null) | Dùng cho `lastSyncAt` ở trang Channels |
| `compactNumber` | `number` → `"1.2M"` | View/like/comment ở `VideoCard` |
| `duration` | `number` (giây) → `"0:38"` | Badge thời lượng trên thumbnail; Shorts < 1 giờ nên không có nhánh `h:mm:ss` |

## Bảng Channels — cột theo đúng Blueprint §Channels

| Cột | Nội dung | Ghi chú |
|---|---|---|
| Kênh | avatar tròn 18px (2 chữ cái đầu tên, nền `--mat-sys-primary`) + tên | Không có cột Channel ID riêng — trùng ý Blueprint |
| URL | URL bỏ `https://`/`www.` để hiển thị, kèm icon `open_in_new`, `href` vẫn dùng URL gốc | |
| Trạng thái | `mat-slide-toggle` — không có label cạnh | |
| Đồng bộ lần cuối | qua pipe `relativeTime` | |
| Ngày thêm | `createdAt \| date:'dd/MM/yyyy'` | |
| Thao tác | icon-button Sửa/Xoá | |

> Blueprint có thêm cột **"Video đang theo dõi" (x/100)** — **bỏ**, vì
> `ChannelDto` hiện tại (`docs/api-contract.md`) không có field nào chứa
> số liệu này. Thêm lại khi backend bổ sung field tương ứng, không tự
> chế số hiển thị.

## Quy tắc style khi dùng Material

1. **Utility Tailwind không đè được style Material** — `.mat-mdc-*` có
   specificity cao hơn. Đổi màu/bo góc/kích thước component Material thì
   đi qua `--mat-*` token của chính component đó (vd
   `--mat-chip-elevated-container-color`), hoặc `mat.theme-overrides()`
   cho token hệ thống. Tailwind chỉ dùng cho layout quanh component và
   markup tự viết. Hệ quả: **component tự viết không có file `.css`** —
   `styleUrl` chỉ xuất hiện khi cần override `--mat-*` (`StatusChip`,
   `VideoFilterBar`) hoặc style layout của Shell.
   Ngoại lệ duy nhất: `.icon-filled` (`FILL 1` của Material Symbols) khai ở
   `styles/tokens.css` — giá trị có dấu nháy nên arbitrary property Tailwind
   bị escape sai khi nằm trong `[class]` binding.
2. **Component render trong CDK overlay** (dialog, snackbar, menu,
   tooltip, select) nằm ngoài cây DOM component → style phải đặt global,
   không đặt trong `styleUrl` của component.
3. Density đã set −2 toàn cục — không chỉnh chiều cao bằng tay.
4. **`mat-form-field appearance="outline"` bị lỗi vạch dọc khi label nổi**
   (Material 20.2.14, hướng LTR): bản CSS compile chỉ ẩn `border-left`
   của `.mdc-notched-outline__notch` bằng màu trong suốt, quên làm tương
   tự cho `border-right` ở LTR (chỉ có ở `[dir=rtl]`) — nên field có giá
   trị/label nổi bị 1 vạch xuyên dọc ô nhập. Đã vá 1 lần ở
   `styles/tokens.css` (`.mdc-notched-outline__notch` lặp 7 lần để thắng
   specificity 5-class của rule lỗi+focus trong Material) — **không cần
   vá lại** ở component khác, mọi `mat-form-field appearance="outline"`
   trong app đều ăn theo global fix này.
