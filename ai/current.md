# Current — FE

> Đang làm gì / block ở đâu. Từng checkbox chi tiết xem
> [`ai/setup-base.md`](setup-base.md). Việc đã xong xem
> [`ai/history.md`](history.md).

## Đang làm
- Global Shell (`src/app/layout/shell/`) — đã có khung sidebar/topbar +
  `app.routes.ts` lazy load (`dashboard`, `channels`), nhưng `pageTitle`
  trong `shell.ts` đang hardcode `'test'`; logic lấy title động theo
  route (`toSignal` + `router.events`) đang bị comment out — cần bật lại
  và hoàn thiện trước khi tick mục 4 trong `setup-base.md`.

## Block (chờ backend)
- Mục 7 — Dashboard: chờ `GetDashboardQuery`.
- Mục 8 — Video Detail: chờ `GetVideoDetailQuery`.
- Mục 9 — Saved Ideas: chờ SavedIdeas CRUD.

## Tiếp theo (chưa bắt đầu, không bị block)
- Shared UI (mục 5 setup-base.md): `StatusChip`, `ScoreBadge`,
  `VideoCard`, `EmptyState`, `Pagination`, `Sparkline` + pipe
  `compactNumber`/`relativeTime`.
- Channel Management slice (mục 6): `ChannelsStore`, trang list, form
  Add — slice nghiệm thu base xong.
