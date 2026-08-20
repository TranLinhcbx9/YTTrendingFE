# Shared Components

Nguồn thiết kế: Blueprint §02. Props viết theo cú pháp hàm mới
(`input()`/`output()`) — thêm component nào thì bổ sung 1 dòng vào bảng
này, không nhúng implementation vào docs.

| Component | Selector | Inputs | Outputs | Ghi chú |
|---|---|---|---|---|
| StatusChip | `app-status-chip` | `status = input.required<'New'\|'Tracking'\|'Archived'>()` | — | Archived tĩnh, Tracking có dot pulse |
| ScoreBadge | `app-score-badge` | `score = input<number \| null>()` | — | `null` → hiện `—` + tooltip "chờ đủ 2 lần đồng bộ", không hiện `0` |
| VideoCard | `app-video-card` | `video = input.required<VideoCardDto>()` | `bookmark = output<string>()` | Thumbnail 9:16, sparkline SVG tĩnh (không Chart.js — nhiều card cùng lúc) |
| EmptyState | `app-empty-state` | `icon`, `title`, `message = input<string>()` | — | Dùng chung cho mọi tab/màn hình rỗng |
| Pagination | `app-pagination` | `page`, `pageSize`, `totalCount = input.required<number>()` | `pageChange = output<number>()` | Map thẳng `PagedResult<T>` backend |
| Sparkline | `app-sparkline` | `points = input.required<number[]>()` | — | SVG polyline thuần |