# Current — FE

> Đang làm gì / block ở đâu. Từng checkbox chi tiết xem
> [`ai/setup-base.md`](setup-base.md). Việc đã xong xem
> [`ai/history.md`](history.md).

## Đang làm
- **Chuyển UI lib PrimeNG → Angular Material 20 (M3)** — **đã apply hết
  Batch 0–9** của [`ai/temp/material-redesign-plan.md`](temp/material-redesign-plan.md):
  gỡ `primeng`/`primeicons`/`@angular/animations`, cài
  `@angular/material` + `@angular/cdk` 20.2.14; `styles/_theme-colors.scss`
  + `styles/material-theme.scss` (`mat.theme()`, density −2);
  `tokens.css` alias sang `--mat-sys-*`; `app.config.ts` gắn
  `errorInterceptor` + `setDefaultFontSetClass`; interceptor dùng
  `MatSnackBar`; Shell = nav rail 80dp + `mat-toolbar`; `StatusChip`.
- `ng build` + `ng lint` pass. Chưa verify bằng mắt trên `ng serve`.
- Tiếp theo: shared UI còn lại (mục 5) rồi slice Channel Management (mục 6).

## Block (chờ backend)
- Mục 7 — Dashboard: chờ `GetDashboardQuery`.
- Mục 8 — Video Detail: chờ `GetVideoDetailQuery`.
- Mục 9 — Saved Ideas: chờ SavedIdeas CRUD.

## Tiếp theo (chưa bắt đầu, không bị block)
- Shared UI (mục 5): `ScoreBadge`, `VideoCard`, `EmptyState`,
  `Sparkline` + pipe `compactNumber`/`relativeTime` (`StatusChip` xong).
  (`Pagination` đã bỏ — dùng `mat-paginator`.)
- Channel Management slice (mục 6): `ChannelsStore`, trang list
  (`mat-table`), form Add, `ConfirmDialog` — slice nghiệm thu base xong.
  Plan cũ [`ai/temp/channel-management-plan.md`](temp/channel-management-plan.md)
  còn dùng được phần Store/Service/models; phần UI đã hết hiệu lực (bảng
  đối chiếu ở cuối `material-redesign-plan.md`).
