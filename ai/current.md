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
    - Filter điểm: `disabled` + tooltip ("`VideoFilter` chưa có param tương
      ứng").
    - Tab Trending / Fast Growing / Saved: hiện `EmptyState` nói rõ chờ gì.
    - `ScoreBadge` luôn `—` (pending), footer card "chờ dữ liệu", nút
      bookmark disabled — bật bằng input `score`/`trendPoints`/
      `bookmarkEnabled` khi có API.
  - Filter chạy thật: chip-search kênh (`mat-chip-grid` + autocomplete,
    đúng mockup), Trạng thái, Views tối thiểu và Time range
    (`VideoFilter.Status`/`MinViews`/`TimeRanges` có sẵn ở BE) — Time range
    mặc định 7 ngày, seed qua `initialFilter` của `withPagedResource`.
  - Channels: click tên kênh → `/dashboard?channelIds=<id>`; empty state +
    avatar dùng lại component shared.
  - Backend đã sửa trước đó: `VideoFilter.ChannelId` → `ChannelIds: int[]?`;
    thêm `MinViews: int?`, `TimeRanges: int?`.
  - **Mobile (<600px) redo theo mockup Screens §Main frame Mobile** —
    `ng build`/`ng lint` pass, verify bằng Playwright screenshot thật (có
    backend), kể cả breakpoint hẹp lẫn rộng (375px, 430px iPhone 14 Pro
    Max, 1440px desktop). `VideoCard` mobile-first chuyển hàng ngang
    (thumb 100px trái + info phải, `sm:` mới về lại layout dọc desktop),
    ẩn sparkline/"waiting for data" ở footer dưới `sm:`. Nút "Filters"
    thêm badge đếm filter đang bật (`channelIds.length` +
    `status`/`minViews` có giá trị) — không tính `timeRanges` vì field
    này luôn có giá trị mặc định, không phải trạng thái "tắt/bật".
  - 2 bug phát sinh từ đợt mobile redo trên, đã vá cùng đợt:
    - `.video-grid` auto-fill chỉ tự ra đúng 1 cột dưới ~376px nội dung —
      card giờ layout hàng ngang (không co dọc theo cột nữa) nên 2 cột
      ~187px (vd content ~390px của iPhone 14 Pro Max, vẫn dưới 600px) ép
      card vỡ chữ/chip tràn viền. Khoá cứng `grid-template-columns: 1fr`
      trong `@media (max-width:599px)` (`dashboard.css`).
    - `.filter-fields--open` là flex column `align-items:stretch` —
      `mat-button-toggle-group` (Time range) và nút "Add filter" không
      khai width riêng nên bị kéo full-width panel (toggle-group thành
      viền pill dài với khoảng trắng chết, nút thì label canh giữa thay
      vì bám trái); không lộ ở ~375px vì tình cờ gần khớp bề rộng panel,
      lộ rõ ở màn rộng hơn. Trả `align-self: flex-start` cho cả 2 trong
      cùng media query (`video-filter-bar.css`).
    - `.filter-fields--open` chưa reset `flex-wrap` (base HTML khai
      Tailwind `flex-wrap` cho desktop bar wrap hàng 2) — ở layout column
      + `max-height:85vh`, hễ tổng chiều cao 5 nhóm filter + nút "Add
      filter" vượt 85vh (dễ xảy ra ở chiều cao màn thật ~667–740px, vd
      iPhone SE/14 Pro Max — test trước đó lỡ dùng viewport cao 900px nên
      không lộ) là nó wrap sang **cột 2** thay vì cuộn, cột 2 trồi lên
      đúng chỗ nút Close đang neo phải → nhìn như "Add filter" dính cạnh
      Close. Thêm `flex-wrap: nowrap` vào `.filter-fields--open`; verify
      lại bằng Playwright cả Chromium lẫn WebKit ở viewport cao thật
      (375×667, 430×740, 360×640).

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
