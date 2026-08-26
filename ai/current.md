# Current — FE

> Đang làm gì / block ở đâu. Từng checkbox chi tiết xem
> [`ai/setup-base.md`](setup-base.md). Việc đã xong xem
> [`ai/history.md`](history.md).

## Đang làm
- **Chuyển UI lib PrimeNG → Angular Material 20 (M3)** — quyết định đổi vì
  quen Material hơn ở chỗ làm; chi phí đổi lúc này gần như bằng 0 vì code
  thật mới dính PrimeNG đúng 3 chỗ (`app.config.ts`, 3 icon trong
  `shell.html`, `error-interceptor.ts`).
- Plan đầy đủ, code copy được theo từng batch:
  [`ai/temp/material-redesign-plan.md`](temp/material-redesign-plan.md).
- Đã xong: docs đồng bộ (mục 0 trong `setup-base.md`) + redesign 2 artifact
  thiết kế sang M3. **Chưa đụng code** — `package.json` vẫn PrimeNG.
- Tiếp theo: Batch 0 (gỡ lib, cài Material).

## Block (chờ backend)
- Mục 7 — Dashboard: chờ `GetDashboardQuery`.
- Mục 8 — Video Detail: chờ `GetVideoDetailQuery`.
- Mục 9 — Saved Ideas: chờ SavedIdeas CRUD.

## Tiếp theo (chưa bắt đầu, không bị block)
- Shared UI (mục 5): `StatusChip`, `ScoreBadge`, `VideoCard`,
  `EmptyState`, `Sparkline` + pipe `compactNumber`/`relativeTime`.
  (`Pagination` đã bỏ — dùng `mat-paginator`.)
- Channel Management slice (mục 6): `ChannelsStore`, trang list
  (`mat-table`), form Add, `ConfirmDialog` — slice nghiệm thu base xong.
  Plan cũ [`ai/temp/channel-management-plan.md`](temp/channel-management-plan.md)
  còn dùng được phần Store/Service/models; phần UI đã hết hiệu lực (bảng
  đối chiếu ở cuối `material-redesign-plan.md`).
