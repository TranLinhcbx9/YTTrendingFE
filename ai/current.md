# Current — FE

> Đang làm gì / block ở đâu. Từng checkbox chi tiết xem
> [`ai/setup-base.md`](setup-base.md). Việc đã xong xem
> [`ai/history.md`](history.md).

## Đang làm
- **Dashboard — Recent Shorts: code xong, `ng build`/`ng lint` pass, CHƯA
  verify tay với backend thật** (checklist verify ở cuối
  `ai/temp/dashboard-recent-shorts-plan.md`).
  - `VideosService` (`features/dashboard/dashboard.service.ts`) gọi
    `GET /api/videos`; `channelIds` lặp key bằng `HttpParams.append`.
  - `withPagedResource<T, TFilter>` nay nhận filter (default rỗng nên
    `ChannelsStore` không phải sửa) + method `setFilter()`.
  - Shared UI mới: `VideoCard`, `ChannelAvatar`, `EmptyState`, pipe
    `compactNumber`/`duration`. `StatusChip` hết tự khai `VideoStatus` —
    dùng chung `VIDEO_STATUS_LABELS` ở `shared/models/video.ts`.
  - UI dựng **đúng mockup Screens §RecentShorts**: filter bar 5 nhóm (label
    trên control) + `mat-tab-group` 4 tab + grid 5 cột + card có
    `ScoreBadge`/bookmark/sparkline. Những gì backend chưa có thì **hiện
    nhưng disabled/pending**, không phải nút giả bấm được:
    - Filter thời gian / điểm / views tối thiểu: `disabled` + tooltip
      ("`VideoFilter` chỉ có `ChannelIds`/`Status`").
    - Tab Trending / Fast Growing / Saved: hiện `EmptyState` nói rõ chờ gì.
    - `ScoreBadge` luôn `—` (pending), footer card "chờ dữ liệu", nút
      bookmark disabled — bật bằng input `score`/`trendPoints`/
      `bookmarkEnabled` khi có API.
  - Filter chạy thật: chip-search kênh (`mat-chip-grid` + autocomplete,
    đúng mockup) và Trạng thái (`VideoFilter.Status` có sẵn ở BE).
  - Channels: click tên kênh → `/dashboard?channelIds=<id>`; empty state +
    avatar dùng lại component shared.
  - Backend đã sửa trước đó: `VideoFilter.ChannelId` → `ChannelIds: int[]?`.

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
- **UI lib PrimeNG → Angular Material 20 (M3)**: hạ tầng xong. Shared UI
  hiện có `StatusChip`, `VideoCard`, `ChannelAvatar`, `EmptyState`,
  `ConfirmDialog`; `ScoreBadge`/`Sparkline` chưa dựng vì chưa có dữ liệu
  (nguyên tắc cuốn chiếu ở `AGENT.md`).

## Block (chờ backend)
- Tab Trending/Fast Growing + `ScoreBadge`/`Sparkline`: `VideoDto` chưa có
  field điểm/snapshot nào (đã verify source backend).
- Tab Saved Videos + nút bookmark trên `VideoCard`: chờ SavedIdeas CRUD.
- Mục 8 — Video Detail: **hết block** (`GetVideoByIdQuery`/`VideoDto` đã có),
  chưa làm.

## Tiếp theo
- Verify tay Dashboard với backend thật (8 bước ở cuối
  `ai/temp/dashboard-recent-shorts-plan.md`), xong mới xoá file plan đó.
- Video Detail (mục 8) — hết block; `VideoCard` sẽ có thêm `open` output
  để điều hướng khi có route detail.
- Chưa tách `withMutationState` cho Videos vì backend chưa có command nào
  cho Video (`api-contract.md` §10) — khi làm SavedIdeas CRUD thì dùng lại.
