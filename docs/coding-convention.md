# Coding Convention — FE

> Bản rút gọn để tra nhanh khi viết code mới / review. Nguồn:
> [Angular style guide](https://angular.dev/style-guide) +
> [Signals guide](https://angular.dev/guide/signals). Style cơ học do
> ESLint (`eslint.config.js`) + Prettier (`package.json`) +
> [`.editorconfig`](../.editorconfig) ép sẵn — mục 1 chỉ liệt kê, không
> lặp. Cấu trúc folder/kiến trúc xem
> [`docs/architecture.md`](architecture.md), không lặp ở đây.

## 1. Style & format — ép sẵn bởi tool
- Selector: component `element` kebab-case prefix `app` (vd `app-shell`),
  directive `attribute` camelCase prefix `app` (vd `[appTooltip]`) —
  `eslint.config.js`.
- Quote: single quote, indent 2 space, print width 100, `insert_final_newline`
  — `.editorconfig` + Prettier.
- `typescript-eslint` recommended + stylistic, `angular-eslint`
  template-recommended + template-accessibility.

## 2. Naming convention

| Thành phần | Quy tắc | Ví dụ |
|---|---|---|
| File | hyphen-case, **không** suffix loại (không `.component.ts`) | `channel-list.ts` |
| Class component/directive/pipe | PascalCase, không suffix loại | `Shell`, `Dashboard` |
| SignalStore | PascalCase + hậu tố `Store` | `ChannelsStore` |
| Service (data-access) | PascalCase + hậu tố `Service` | `ChannelsService` |
| Interface (model/DTO) | PascalCase, **không** prefix `I` (khác BE — convention TS chính thức bỏ `I`, xem nguồn đầu file) | `Channel`, `PagedResult<T>` |
| Method | camelCase, verb đầu, đặt tên theo hành động không theo cơ chế trigger | `loadChannels()`, `addChannel()` — không `handleClick()` |
| Signal public (state/computed) | camelCase | `channels`, `isLoading` |
| Signal private trong class | prefix `_` | `_channels` |
| `input()`/`output()`/`model()`/query | camelCase, `readonly`, đặt theo dữ liệu/sự kiện | `channelId`, `channelSelected` |
| Boolean | prefix `is`/`has`/`can` | `isEnabled`, `hasNext` |
| Generic type param | `T` hoặc `T` + tên | `T`, `TItem` |

- Directive selector áp prefix app camelCase (mục 1).
- Property Angular-specific (inject deps, `input()`, `output()`, `model()`,
  query) gom đầu class, trước method.
- `protected` cho member chỉ template dùng, không phải API public của
  class; `readonly` cho property Angular tự gán.
- DI: dùng hàm `inject()`, **không** dùng constructor injection.

**Import path** — alias khai ở `tsconfig.json` (`compilerOptions.paths`):

| Import | Cách viết | Ví dụ |
|---|---|---|
| Cùng folder | tương đối | `'./problem-details'` |
| Khác folder | alias, **không** `../../` | `'@core/http/error-interceptor'` |

Alias có sẵn: `@core/*`, `@shared/*`, `@features/*`, `@env/*`. Thêm alias
mới thì sửa `tsconfig.json` (1 nơi duy nhất, `tsconfig.app.json` extends
theo).

## 3. Service (data-access)

**Trách nhiệm**: owns HTTP communication · defines API endpoint · map
request/response khi cần (DTO thô ↔ shape khác) · **không** own
feature/UI state.

- 1 service / feature, chỉ gọi `HttpClient`/`httpResource()`, trả
  `Observable`/`Promise`/resource — **không** giữ state, không `inject`
  ngược Store của chính nó.
- GET dùng làm `stream` cho `rxResource()` (params hay đổi, cần cancel
  request cũ) → trả `Observable`, **không** `firstValueFrom()`. Mutation
  (create/update/delete, gọi Promise 1 lần theo click) → trả `Promise`
  qua `firstValueFrom()` như bình thường. Lý do phân biệt xem mục
  `resource() vs rxResource()` ở `architecture.md`.
- Method đặt tên theo hành động trên tài nguyên (`getChannels`,
  `createChannel`), không theo HTTP verb (`post`, `get`).
- Base URL luôn qua `environment.ts` (invariant `AGENT.md`) — service
  không tự ghép string URL rải rác.
- Cần map response thô → shape khác cho UI (vd gộp field, đổi format) thì
  map ngay trong Service — Store nhận thẳng shape đã đúng, không tự map
  lại lần 2.
- Service của feature nào chỉ Store/component của feature đó dùng — dùng
  chéo thì chuyển lên `shared/`/`core/` (xem `architecture.md`).

## 4. SignalStore

**Trách nhiệm**: owns feature state · expose state read-only · expose
feature actions · orchestrate API (qua Service) + state · mutate state
nội bộ (không cho ngoài mutate trực tiếp).

- 1 store / feature (đã là invariant ở `AGENT.md`); method đặt tên theo
  hành động (`loadChannels`, `addChannel`), không đặt theo cơ chế
  (`fetch`, `handle`).
- Store gọi Service để lấy/ghi data — **không** tự gọi `HttpClient`/
  `httpResource()` thẳng trong store.
- Đổi state chỉ qua `patchState()` bên trong store — component **không**
  patch trực tiếp, chỉ gọi method store expose (feature actions).
- `resource()`/`rxResource()` (loader/stream gọi method Service) tự quản
  `value/loading/error` — không tự set 3 biến này tay (nguyên tắc đã có
  ở `architecture.md`, nhắc lại ở đây vì hay bị phá khi thêm optimistic
  update).
- State/computed expose ra ngoài **luôn** qua `computed()` hoặc field
  `resource()` gốc (read-only) — không expose signal ghi được
  (`WritableSignal`) ra khỏi store.
- Store của trang list dùng `withPagedResource<T>(() => …)` — expose sẵn
  `items`/`totalCount`/`totalPages`/`hasNext`/`isLoading`/`loadError` +
  `setPage`/`reload`/`resetToFirstPage`. Template gọi `store.items()`
  (tên chung mọi feature), không đặt alias riêng theo domain.
- Lệnh ghi (create/update/delete) dùng `withMutationState()` — gọi
  `runFormMutation()` (lệnh từ form → `isSubmitting`/`formError`) hoặc
  `runActionMutation()` (lệnh từ nút hành động → `isActionRunning`/
  `actionError`), **không** tự viết `try/catch` + `patchState` ở từng
  method. Side-effect sau khi thành công (`reload()`,
  `resetToFirstPage()`) để ở store method, chạy khi kết quả trả `true`.
- Phần dùng chung tách thành `signalStoreFeature()` ở `shared/store/`,
  không copy state/logic giữa các store.

## 5. Component & Template

- Giữ template thuần presentation — logic phức tạp chuyển vào
  `computed()`/method trong class, không viết biểu thức phức tạp trực
  tiếp trong template.
- Dùng binding `class`/`style` chuẩn thay vì `NgClass`/`NgStyle`.
- Control flow mới: `@if`/`@for`/`@switch` (đã chốt ở `AGENT.md`), không
  dùng `*ngIf`/`*ngFor`.
- Lifecycle hook giữ đơn giản — logic phức tạp tách method riêng có tên,
  hook chỉ gọi lại; implement interface (`OnInit`...) để compiler ép đúng
  tên method.

## 6. Signals

- `signal()` — state có thể ghi trực tiếp (`.set()`/`.update()`).
- `computed()` — giá trị dẫn xuất, read-only, tự memoize; ưu tiên dùng
  thay vì tính lại trong template hoặc getter thường.
- `effect()` — chỉ dùng cho side-effect ra ngoài hệ signal (thao tác DOM
  thủ công, tích hợp lib ngoài...); **không** dùng để đồng bộ 2 signal
  với nhau (dùng `computed()` thay).
- Signal riêng của class: prefix `_`, expose bản đọc-only qua
  `.asReadonly()`.
- Reactive context của `effect()`/`computed()` chỉ theo dõi được code
  đồng bộ — đọc signal trước `await`, không phải sau.
- Không có cơ chế chặn deep-mutation object/array bên trong signal —
  không mutate trực tiếp, luôn `.set()`/`.update()` giá trị mới.

## 7. RxJS ↔ Signals

- Ưu tiên `signal()`/`resource()`/`rxResource()`/`httpResource()`; chỉ
  dùng RxJS khi cần operator chưa có bản signal-equivalent gọn (debounce,
  combine nhiều stream phức tạp).
- Chuyển RxJS → signal ở boundary bằng `toSignal()`, **không** `subscribe()`
  tay trong component (tránh phải tự quản unsubscribe).

## 8. HTTP / Model / Error

- Interface model đặt tên khớp response BE (BE trả JSON camelCase — xem
  coding-convention BE mục 11), **không** tự đổi tên field khi map DTO.
- Lỗi HTTP xử lý tập trung ở 1 interceptor theo bảng mapping đã có ở
  [`architecture.md`](architecture.md) — component **không** tự
  try/catch lỗi HTTP riêng lẻ.

## 9. TypeScript / chung

- Ưu tiên nhất quán trong 1 file hơn ép cứng rule khi 2 cái xung đột
  (nguyên tắc chính thức của Angular style guide).
- Strict mode đã bật lúc `ng new` — không tắt `strict`/`noImplicitAny`.
- `interface` cho model/object shape (mở rộng được qua declaration
  merging), `type` cho union/alias.

## 10. Test & commit

Xem `AGENT.md` mục Lệnh (test hoãn Phase 1, commit convention).
