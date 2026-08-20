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
        ├── channels/      # component + channels.store.ts + models
        ├── dashboard/     # component + dashboard.store.ts + models
        └── video-detail/  # component + video-detail.store.ts + models

1 feature = 1 folder — component, store, model cạnh nhau, sửa tính năng
chỉ mở đúng 1 folder (mirror `Application/Features/` bên backend).

## Nguyên tắc

- **1 SignalStore / feature**, không có 1 store khổng lồ dùng chung.
- **`resource()`/`httpResource()`** gọi trong store — không tự tay quản
  `loading/error/data`.
- **1 interceptor lỗi duy nhất** map theo bảng dưới — không xử lý lỗi rải
  rác ở từng feature.

## Mapping lỗi (Result Pattern backend → UI)

| HTTP / ErrorType | UI |
|---|---|
| 400 Validation | Lỗi inline dưới field (map `fields` camelCase) |
| 404 NotFound | Toast + quay lại trang trước |
| 409 Conflict | Inline ngay tại hành động gây lỗi |
| 5xx / network | Toast + nút Thử lại |

## SignalStore ↔ NgRx classic

Đọc để hiểu cả 2 — phần lớn công ty hiện tại vẫn dùng bản classic, phỏng
vấn Angular senior hay hỏi khái niệm classic. Không cần code lại bản classic
trong project này, bảng dưới là để map khái niệm khi cần.

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
Angular Material vẫn là cái được nhắc nhiều hơn trong JD/phỏng vấn vì là
thư viện chính thức của Angular team — biết PrimeNG vẫn là kỹ năng thật
(nhiều công ty dùng, nhất là app nhiều dữ liệu) nhưng không phổ biến bằng,
cần biết đánh đổi này.