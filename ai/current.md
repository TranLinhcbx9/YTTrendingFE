# Current — FE

> Đang làm gì / block ở đâu. Từng checkbox chi tiết xem
> [`ai/setup-base.md`](setup-base.md). Việc đã xong xem
> [`ai/history.md`](history.md).

## Đang làm

- **UI parity với Stitch — batch 1–7: code complete; `ng build`/`ng lint` pass.**
  - Shell dùng gutter chuẩn 24px desktop / 16px mobile, đã bỏ padding chồng
    tại Channels, Sync history và Sync run detail. Card, empty state và metric
    dùng cùng surface/border/mono treatment.
  - Channels có panel thêm channel, heading **Tracked channels**, header
    **Actions**, dialog spacing/warning rõ hơn và vẫn giữ bảng cuộn ngang trên
    mobile; Sync history/run detail giữ card riêng ở mobile.
  - Dashboard/VideoCard, Sync flows và Video Detail đã đồng nhất mật độ,
    touch target/action mobile, hero/metric/pending/archived presentation;
    store, service, API, filter, polling và CRUD không đổi.
  - Batch 8 đã edit trực tiếp 12 screen chuẩn trong project Stitch hiện có và
    đồng bộ HTML/PNG cùng metadata local ở `.stitch/`. `DESIGN.md` local đã
    phản ánh filter/table/mobile rules mới. Chỉ còn checkpoint xác nhận trước
    khi cập nhật design system đang active của project (ảnh hưởng mọi screen
    sinh sau này).

- **Global Sync all header action: code complete; build/lint/Prettier pass.**
  - The persistent header is now the sole entry point for a global sync; it
    retains the existing loading, error, and run-detail navigation flow.

- **Table template standardization: code complete; `ng build`/`ng lint` and
  Prettier pass. Manual responsive verification with rendered data remains.**
  - Channels, Sync history and Sync run detail now share Material
    `mat-table` plus the global `app-data-table-shell`; filters, actions,
    pagination and store/API flows are unchanged.
- **Sync history / Sync all: code xong, `ng build`/`ng lint` pass, CHƯA verify
  tay với backend thật.**
  - Route `/sync-history` tạo run qua `POST /api/jobs/sync`, điều hướng ngay
    tới detail, map hai lỗi `409` đúng contract; có history thật từ
    `GET /api/jobs`, filter status/source/time range (cả custom range), loading/
    empty/error states và pagination.
  - Custom range dùng Material datepicker; From/To không chọn được ngày tương
    lai, To tối đa ngày hiện tại và hai đầu luôn giữ `From <= To`. Giá trị gửi
    lên API giữ đúng ngày user chọn, không bị lệch timezone.
  - Route `/sync-history/:runId` poll summary + item page 3 giây cho tới trạng
    thái terminal; có metric/progress, filter status, paginator, lỗi/retry,
    desktop failure inspector và mobile bottom sheet để xem/copy error code.
  - Có preview dev-only (`?preview=running|completed-with-issues|interrupted|failed`)
    vì worker Batch 1–3 hiện mới có thể giữ run ở `Pending`.
  - Không làm action cancel/retry item/retry run/resume; mọi retry vẫn là tạo
    Sync all run mới. Reference visual giữ ở `.stitch/designs/`.
- **Channel sync (single): code xong, `ng build` pass, CHƯA verify tay với backend thật.**
  - `POST /api/channels/{id}/sync` đã wire qua `ChannelsService` →
    `ChannelsStore` → nút Sync trong từng row; spinner đúng row, reload
    `lastSyncAt` sau khi thành công. Response `SyncChannelResultDto` được
    giữ qua service/store để toast hiển thị riêng số video mới phát hiện và
    số video bắt đầu theo dõi, cùng số refreshed/archived;
    lỗi Result pattern dùng luồng action hiện có.
  - Đồng bộ `ChannelDto.uploadsPlaylistId` vào model FE.
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
    trên control) + `mat-tab-group` 4 tab + grid 5 cột + card có score
    overlay/bookmark/sparkline. Những gì backend chưa có thì **hiện
    nhưng disabled/pending**, không phải nút giả bấm được:
    - Filter điểm: `disabled` + tooltip ("`VideoFilter` chưa có param tương
      ứng").
    - Tab Trending / Fast Growing / Saved: hiện `EmptyState` nói rõ chờ gì.
    - Score luôn `—` (pending), footer card "chờ dữ liệu", nút
      bookmark disabled — bật bằng input `score`/`trendPoints`/
      `bookmarkEnabled` khi có API.
  - VideoCard vừa đối chiếu lại source screen Stitch
    `Recent Shorts Dashboard (Desktop)`: badge kênh/score/duration nằm trên
    thumbnail, metric gộp một dòng và footer có divider, status/velocity cùng
    action mở YouTube/lưu ý tưởng. Mobile vẫn là hàng ngang dùng cùng cấu trúc;
    không đổi store, API hay behavior action.
  - Filter chạy thật: chip-search kênh (`mat-chip-grid` + autocomplete,
    đúng mockup), Trạng thái, Views tối thiểu và Time range
    (`VideoFilter.Status`/`MinViews`/`TimeRanges` có sẵn ở BE) — Time range
    mặc định 7 ngày, seed qua `initialFilter` của `withPagedResource`.
  - Filter Dashboard nay theo pattern Sync history: `mat-form-field` +
    `mat-select` dropdown có label (Time range/Status), Channel/Min views cùng
    hệ outline field và Clear filters. Layout chung nằm ở
    `app-filter-toolbar`; Sync run vẫn giữ status strip riêng theo yêu cầu.
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
  - Mobile bug phát sinh từ đợt redo trên, đã vá cùng đợt:
    - `.video-grid` auto-fill chỉ tự ra đúng 1 cột dưới ~376px nội dung —
      card giờ layout hàng ngang (không co dọc theo cột nữa) nên 2 cột
      ~187px (vd content ~390px của iPhone 14 Pro Max, vẫn dưới 600px) ép
      card vỡ chữ/chip tràn viền. Khoá cứng `grid-template-columns: 1fr`
      trong `@media (max-width:599px)` (`dashboard.css`).

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
  (nguyên tắc cuốn chiếu ở `AGENTS.md`).

- Mutation feedback: Add/Edit show a spinner on the submit button; per-row Sync
  shows a spinner on the active row; Delete keeps its confirmation dialog open
  with a spinner until the request succeeds. Controls are disabled during the
  respective command to prevent duplicate requests.

## Block (chờ backend)

- Tab Trending/Fast Growing + `ScoreBadge`/`Sparkline`: `VideoDto` chưa có
  field điểm/snapshot nào (đã verify source backend).
- Tab Saved Videos + nút bookmark trên `VideoCard`: chờ SavedIdeas CRUD.
- Mục 8 — Video Detail: **hết block** (`GetVideoByIdQuery`/`VideoDto` đã có),
  chưa làm.

## Tiếp theo

- Verify tay Sync history với backend Batch 1–3: create `202` + route detail,
  Pending polling, status filter/paginator, `409` mappings và `404`/network
  retry; dùng preview dev để check terminal/error inspector trong khi worker
  chưa chuyển state thật.
- Verify tay Dashboard với backend thật (8 bước ở cuối
  `ai/temp/dashboard-recent-shorts-plan.md`), xong mới xoá file plan đó.
- Video Detail (mục 8) — hết block; `VideoCard` sẽ có thêm `open` output
  để điều hướng khi có route detail.
- Chưa tách `withMutationState` cho Videos vì backend chưa có command nào
  cho Video (`api-contract.md` §10) — khi làm SavedIdeas CRUD thì dùng lại.
