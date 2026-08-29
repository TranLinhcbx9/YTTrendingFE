# Architecture — FE

## Cấu trúc thư mục

    src/app/
    ├── core/            # HttpClient wrapper, errorInterceptor, app.config.ts
    ├── shared/
    │   ├── ui/          # StatusChip, VideoCard, ChannelAvatar, EmptyState... (Blueprint §02)
    │   ├── pipes/       # compactNumber, duration, relativeTime
    │   ├── store/       # signalStoreFeature dùng chung (withPagedResource,
    │   │                #   withMutationState)
    │   ├── data-access/ # Service dùng chéo ≥2 feature (ChannelsService)
    │   └── models/      # interface DTO dùng chung (Channel, Video, PagedResult<T>...)
    ├── layout/          # Global Shell (Blueprint §03)
    └── features/
        ├── channels/
        │   ├── channels.ts/.html         # route component (smart)
        │   ├── channels.store.ts
        │   ├── channels.models.ts        # model riêng feature (nếu có)
        │   └── channel-edit-dialog/      # mỗi component con = 1 folder
        ├── dashboard/
        │   ├── dashboard.ts/.html        # route component (smart)
        │   ├── dashboard.store.ts
        │   ├── dashboard.service.ts      # VideosService — gọi /api/videos
        │   └── video-filter-bar/
        └── video-detail/

1 feature = 1 folder — component, store, service, model cạnh nhau, sửa
tính năng chỉ mở đúng 1 folder.

**Bố cục bên trong 1 feature:**

- Root feature chỉ chứa **bộ 3 entry point** (route component + store +
  service) — 3 file mở nhiều nhất, luôn ở tầng đầu, không lặn vào folder.
- **Mọi component con đều có folder riêng** (`channel-edit-dialog/`), kể
  cả khi mới 2 file — thống nhất với `shared/ui/` cũng folder-per-component.
- **Chưa thêm tầng bọc `components/`**: root feature chỉ có 3-4 file phẳng
  + vài folder con là đã tự đọc được. Khi 1 feature phình ~6+ component con
  mới gom vào `components/` — lúc đó chỉ là đổi chỗ folder, không phải tách
  file.

## Nguyên tắc

- **1 SignalStore / feature**, không có 1 store khổng lồ dùng chung.
- **Service (`*.service.ts`) là tầng data-access duy nhất** gọi
  `HttpClient`/`httpResource()` — trả `Observable`/`Promise`/resource,
  **không giữ state**, không biết Angular Material/UI.
- **Store chỉ giữ state**, gọi qua Service (không tự gọi `HttpClient`);
  `resource()`/`rxResource()`/`httpResource()` dùng Service làm
  loader/stream — không tự tay quản `loading/error/data`.
- **GET có params hay đổi** (pagination, filter, search) → Service trả
  `Observable`, Store dùng `rxResource({ params, stream })` — cancel
  request cũ thật khi params đổi (xem lý do ở mục `resource()` vs
  `rxResource()` bên dưới). Mutation (create/update/delete, chạy 1 lần
  theo click) → Service trả `Promise`, Store `await` trực tiếp trong
  `withMethods`, không cần resource.
- **1 interceptor lỗi duy nhất** map theo bảng dưới — không xử lý lỗi rải
  rác ở từng feature. Bóc `ProblemDetails` từ lỗi luôn qua
  `toProblemDetails()` (`core/http/problem-details.ts`) — **không** cast
  tay `(err as HttpErrorResponse).error`, vì lỗi mạng/CORS trả
  `ProgressEvent` chứ không phải `ProblemDetails`.
- **Danh sách phân trang dùng `withPagedResource()`**
  (`shared/store/with-paged-resource.ts`) thay vì mỗi store tự dựng lại
  `page`/`pageSize` + resource — backend dùng chung `PagedQuery`/
  `PagedResult<T>` cho mọi endpoint list (`api-contract.md` §5), gom 1 chỗ
  để chi tiết dễ sai (page 1-based vs `mat-paginator` 0-based, không có
  `hasPrevious`) chỉ phải đúng 1 lần.

## Luồng data (Component → API → UI)

    Template            đọc signal (`store.channels()`) — không tự gọi HTTP
      │  gọi method (vd `store.loadChannels()`)
      ▼
    Store method        set input cho `resource()` (params, filter...) —
                         loader là method của Service, Store không tự set
                         `loading/error/data` tay
      ▼
    Service              gọi `HttpClient`/`httpResource()`, base URL từ
                         `environment.ts` — không giữ state, chỉ trả data
      ▼
    API (BE)             trả DTO (JSON camelCase) hoặc Error (Result pattern)
      │
      ├─ Thành công → Service trả data → `resource()` set `value()` →
      │  store expose qua `computed()` → template render lại (signal
      │  reactivity)
      │
      └─ Lỗi → interceptor toàn cục bắt trước, map theo bảng dưới
         (snackbar/inline) — đồng thời `resource().error()` vẫn có, dùng khi feature
         cần trạng thái lỗi cục bộ (vd disable nút) ngoài phần interceptor
         đã xử lý chung.

- Component **không bao giờ** gọi Service/`HttpClient` trực tiếp — luôn
  qua method của Store (đã là invariant `AGENT.md` + mục 3+4
  `coding-convention.md`).
- Service **không bao giờ** bị Store nào khác dùng chéo ngoài feature của
  nó (mirror ranh giới `Application/Features/` bên backend) — cần dùng
  chung thì đưa lên `shared/` hoặc `core/`, không import service của
  feature khác.
- Optimistic update (nếu có) sửa `computed()`/state tạm trong Store, không
  sửa response gốc từ `resource()`.

## Mapping lỗi (Result Pattern backend → UI)

| HTTP / ErrorType | UI |
|---|---|
| 400 Validation | Lỗi inline dưới field qua `mat-error` (map `fields` camelCase) |
| 404 NotFound | Snackbar |
| 409 Conflict | Inline ngay tại nơi phát lệnh — xem bảng dưới |
| 5xx / network | Snackbar + nút Thử lại |

Interceptor chỉ bắn snackbar cho **404 và 5xx**. 400/409 đi thẳng về
component vì luôn gắn với 1 field hoặc 1 hành động cụ thể.

**Không auto-navigate-back sau 404** — Add nằm ngay trên trang list nên
back không có ý nghĩa; chỉ thêm navigate-back khi có feature thật sự cần
(theo nguyên tắc cuốn chiếu ở `AGENT.md`).

### Báo kết quả lệnh ghi

Chỗ báo **lỗi** theo đúng làn của `withMutationState` (nguồn phát lệnh);
báo **thành công** thì luôn là snackbar.

| Nguồn phát | Thành công | Thất bại |
|---|---|---|
| Form (add, dialog sửa) | `notification.success()` | Inline trong form: `errors.<field>` dưới field, còn lại 1 dòng `store.formErrorMessage()` cuối form |
| Nút hành động (toggle, xoá) | `notification.success()` | `notification.mutationError(store.actionError(), …)` — không có form để hiện inline |

`formErrorMessage` tự lọc bỏ lỗi field-level (đã hiện dưới field) và
404/5xx (interceptor đã snackbar); `mutationError()` lọc y hệt. Nhờ vậy 1
lỗi chỉ hiện đúng 1 chỗ.

### Snackbar — chỉ qua `NotificationService`

`core/ui/notification.service.ts` là **nơi duy nhất** gọi `MatSnackBar`:
`success()` / `error()` / `mutationError()`, cùng vị trí (`end` +
`bottom`). Component **không** tự `inject(MatSnackBar)` — vị trí toast sẽ
lệch nhau giữa các màn.

Màu: thành công giữ default M3 (`inverse-surface`), lỗi dùng class
`app-snackbar-error` (`--mat-sys-error`) — style + lý do chọn màu ở
`styles/tokens.css`.

## SignalStore ↔ NgRx classic

| SignalStore | NgRx classic | Ý nghĩa |
|---|---|---|
| `withState({...})` | State ban đầu trong Reducer | Shape state |
| `withComputed(...)` | `createSelector` | Giá trị dẫn xuất từ state |
| `withMethods()` gọi `patchState()` | Action + case trong Reducer | Đổi state |
| `withMethods()` gọi HTTP/side-effect | `createEffect` | Side-effect ngoài state thuần |
| `inject(XStore)` thẳng trong component | `store.select()` + `store.dispatch()` | Component đọc/ghi state |

## `resource()` vs `rxResource()` vs RxJS thủ công

Cả 3 biến thể (`resource()`, `rxResource()`, `httpResource()`) đều tự
quản `value/loading/error` cho 1 async call thay vì tự set 3 biến đó tay
(bản gọn của `httpClient.get<T>(url).pipe(switchMap(...), catchError(...))`
— pattern cũ vẫn thấy rải rác trong codebase công ty).

**Khác nhau ở cancellation** — dễ nhầm nên ghi rõ:
- `resource()` với loader trả `Promise` (vd qua `firstValueFrom`) — khi
  params đổi, `resource()` chỉ **bỏ qua kết quả cũ** lúc set `value()`,
  request HTTP cũ **vẫn chạy tới cùng dưới nền** vì `Promise` không có
  khái niệm huỷ giữa chừng.
- `rxResource()` với `stream` trả `Observable` — khi params đổi,
  Angular `unsubscribe()` Observable cũ, `HttpClient` huỷ request HTTP
  thật (XHR/fetch abort) theo hành vi unsubscribe chuẩn của nó.

→ GET có params đổi nhanh (pagination, filter) dùng `rxResource()` +
Service trả `Observable`. Mutation 1 lần (không có kịch bản cần huỷ) thì
Promise vẫn ổn — không cần đổi hết sang `rxResource()`.

## UI library

**Angular Material 20 (Material Design 3)** + Material Symbols. Palette
generate từ seed teal `#2BD4C2`, dark-first, density −2.

- Chia component "dùng sẵn" vs "tự viết": `docs/components.md`.
- Token màu/chữ/shape: `docs/design-tokens.md`.
- Material 20 **không** còn peer-dep `@angular/animations` (animation chạy
  bằng CSS) → không cần `provideAnimationsAsync()`.
- Angular Material **không có** component navigation rail — Global Shell tự
  dựng rail, chỉ `mat-toolbar` là của Material.
