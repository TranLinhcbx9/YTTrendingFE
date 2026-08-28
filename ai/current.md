# Current — FE

> Đang làm gì / block ở đâu. Từng checkbox chi tiết xem
> [`ai/setup-base.md`](setup-base.md). Việc đã xong xem
> [`ai/history.md`](history.md).

## Đang làm
- **Channel Management CRUD — xong, đã verify tay với backend thật** (mục
  6 `ai/setup-base.md` đã tick). Đợt cuối có refactor để ổn định kiến
  trúc trước khi sang feature sau:
  - `getChannels()` trả `Observable` + Store dùng `rxResource()` thay
    `resource()`/`Promise` — cancel request thật khi đổi trang. Mutation
    vẫn `Promise` (không có kịch bản cần huỷ).
  - Tách `shared/store/`: `withPagedResource<T>()` (page/pageSize +
    resource + items/totalCount/loadError, dùng chung mọi endpoint list
    vì backend chung `PagedQuery`/`PagedResult<T>`) và
    `withMutationState()` (2 làn form/action: `isSubmitting`+`formError`,
    `isActionRunning`+`actionError`).
  - `toProblemDetails()` ở `core/http/` — bịt lỗ cast tay: lỗi mạng/CORS
    trả `ProgressEvent` chứ không phải `ProblemDetails`, trước đó UI im
    lặng không báo gì.
  - Bố cục feature: root giữ route component + store + service, mỗi
    component con 1 folder (`channel-edit-dialog/`).
- **UI lib PrimeNG → Angular Material 20 (M3)**: hạ tầng xong. Batch 8
  (shared UI) mới có `StatusChip`; `ScoreBadge`, `VideoCard`,
  `EmptyState`, `Sparkline` chưa làm — thuộc Dashboard/Video Detail đang
  block, chưa đụng tới nên chưa dựng (nguyên tắc cuốn chiếu ở `AGENT.md`).

## Block (chờ backend)
- Mục 7 — Dashboard: chờ `GetDashboardQuery`.
- Mục 8 — Video Detail: chờ `GetVideoDetailQuery`.
- Mục 9 — Saved Ideas: chờ SavedIdeas CRUD.

## Tiếp theo
- Feature list tiếp theo (Videos/Dashboard khi hết block): dùng lại
  `withPagedResource()` — `GET /api/videos` có filter `channelId`/`status`
  nên thêm filter vào params của resource, chỗ này `rxResource` cancel
  mới phát huy rõ.
- Shared UI còn lại (mục 5: `ScoreBadge`, `VideoCard`, `EmptyState`,
  `Sparkline` + pipe `compactNumber`) — để tới khi Dashboard hoặc Video
  Detail hết block.
- Chưa tách `withMutationState` cho Videos vì backend chưa có command nào
  cho Video (`api-contract.md` §10) — khi làm SavedIdeas CRUD thì dùng lại.
