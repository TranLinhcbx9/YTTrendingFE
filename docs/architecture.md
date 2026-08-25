# Architecture — FE

## Cấu trúc thư mục

    src/app/
    ├── core/            # HttpClient wrapper, errorInterceptor, app.config.ts
    ├── shared/
    │   ├── ui/          # StatusChip, ScoreBadge, VideoCard... (Blueprint §02)
    │   ├── pipes/       # compactNumber, relativeTime
    │   └── models/      # interface DTO dùng chung (Channel, Video, PagedResult<T>...)
    ├── layout/          # Global Shell (Blueprint §03)
    └── features/
        ├── channels/      # component + channels.store.ts + channels.service.ts + models
        ├── dashboard/     # component + dashboard.store.ts + dashboard.service.ts + models
        └── video-detail/  # component + video-detail.store.ts + video-detail.service.ts + models

1 feature = 1 folder — component, store, service, model cạnh nhau, sửa
tính năng chỉ mở đúng 1 folder

## Nguyên tắc

- **1 SignalStore / feature**, không có 1 store khổng lồ dùng chung.
- **Service (`*.service.ts`) là tầng data-access duy nhất** gọi
  `HttpClient`/`httpResource()` — trả `Observable`/`Promise`/resource,
  **không giữ state**, không biết PrimeNG/UI.
- **Store chỉ giữ state**, gọi qua Service (không tự gọi `HttpClient`);
  `resource()`/`httpResource()` dùng Service làm loader — không tự tay
  quản `loading/error/data`.
- **1 interceptor lỗi duy nhất** map theo bảng dưới — không xử lý lỗi rải
  rác ở từng feature.

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
      └─ Lỗi → interceptor toàn cục bắt trước, map theo bảng dưới (toast/
         inline) — đồng thời `resource().error()` vẫn có, dùng khi feature
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
| 400 Validation | Lỗi inline dưới field (map `fields` camelCase) |
| 404 NotFound | Toast + quay lại trang trước |
| 409 Conflict | Inline ngay tại hành động gây lỗi |
| 5xx / network | Toast + nút Thử lại |

## SignalStore ↔ NgRx classic

| SignalStore | NgRx classic | Ý nghĩa |
|---|---|---|
| `withState({...})` | State ban đầu trong Reducer | Shape state |
| `withComputed(...)` | `createSelector` | Giá trị dẫn xuất từ state |
| `withMethods()` gọi `patchState()` | Action + case trong Reducer | Đổi state |
| `withMethods()` gọi HTTP/side-effect | `createEffect` | Side-effect ngoài state thuần |
| `inject(XStore)` thẳng trong component | `store.select()` + `store.dispatch()` | Component đọc/ghi state |

## `resource()` vs RxJS thủ công

`resource()`/`httpResource()` tự quản `value/loading/error` cho 1 async
call, tự huỷ request cũ khi input đổi (như `switchMap` ngầm). Phần lớn
codebase công ty hiện tại vẫn viết
`httpClient.get<T>(url).pipe(switchMap(...), catchError(...))` rồi tự set
biến `loading/error/data` tay — `resource()` là bản gọn của đúng pattern
đó, không phải khái niệm khác.

## UI library

PrimeNG + PrimeIcons (đã chốt ở Blueprint — nhiều component sẵn cho
dashboard nhiều số liệu: table, chart, slider, toast, confirm dialog).
