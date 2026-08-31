# Shorts Trend Monitor — FE (Phase 1)

## Mục tiêu
Giao diện Angular cho công cụ theo dõi kênh YouTube Shorts đối thủ, phát
hiện video tăng trưởng tốt để tham khảo ý tưởng content. Thiết kế UI
(Blueprint + mockup từng màn hình): xem mục [Tài liệu](#tài-liệu).

## Stack
- Angular (bản mới nhất khi tạo dự án), standalone components, Signals
- State: `@ngrx/signals` (SignalStore) — 1 store / feature
- Data fetching: `resource()` / `httpResource()`
- UI: Angular Material 20 (Material Design 3) + Material Symbols
- Style: Tailwind CSS v4 (CSS-first config qua `@theme`)

## Invariant
- Base URL API: khai trong `environment.ts` — **1 nơi duy nhất**, không
  hardcode URL ở component/service khác.
- Màu/font: **1 nơi duy nhất** — `styles/tokens.css` (alias ngữ nghĩa của
  app trỏ vào M3 role `--mat-sys-*`). Component không tự khai hex/font
  riêng. Palette gốc ở `styles/_theme-colors.scss` — **máy sinh, không sửa
  tay**; đổi màu thương hiệu = generate lại từ seed.
- Style component Material chỉnh qua `--mat-*` token của component đó,
  **không** bằng utility Tailwind (specificity không thắng).
- VideoId (YouTube cấp) là khóa duy nhất so sánh video — không dùng
  title/thumbnail.
- ARCHIVED là trạng thái cuối — UI không có action đưa video quay lại
  TRACKING.
- Lỗi từ backend theo Result pattern (400 field-level / 404 / 409) — map
  theo đúng 1 bảng trong `docs/architecture.md`, không tự chế cách xử lý
  lỗi mới ở từng feature.
- Toàn bộ text hiển thị trên UI dùng tiếng Anh — kể cả khi mockup/thiết kế gốc đang là tiếng Việt thì vẫn convert sang tiếng Anh

## Lệnh
- `ng serve` — dev server
- `ng build` — build production
- `ng lint` — lint
- Test: Phase 1 CHƯA dùng (hoãn, xem `ai/setup-base.md`) — đừng tự thêm
  test/CI
- Commit: conventional commits (`feat:`/`fix:`/`docs:`…); làm trên
  `develop`, PR về `master` (đồng bộ flow với BE)

## Quy ước
- 1 feature = 1 folder (`features/<name>/`), root chứa route component +
  `*.store.ts` + `*.service.ts` + models; **mỗi component con 1 folder
  riêng**. Service gọi API (data-access, không giữ state), Store giữ
  state + gọi Service — không để Store tự gọi
  `HttpClient`/`httpResource()` thẳng (chi tiết
  [`docs/architecture.md`](docs/architecture.md)).
- State/logic lặp giữa các store tách thành `signalStoreFeature()` ở
  `shared/store/` (`withPagedResource`, `withMutationState`) — không copy
  giữa feature.
- Component dùng cú pháp hàm mới: `input()`/`output()`/`model()`, control
  flow `@if`/`@for`/`@switch`.
- Setup base/hạ tầng theo nhu cầu: chỉ dựng trước phần cần cho toàn app
  (scaffold, style token, `environment.ts`, HttpClient). Phần còn lại
  (interceptor lỗi, guard, v.v.) để `[ ]` trong `ai/setup-base.md` đến
  khi feature thật sự chạm tới — nhắc trước khi bắt tay, không dựng sẵn.

## Hiệu suất token
- Đọc file có mục tiêu: dùng Grep/Glob tìm đúng đoạn/dòng cần trước, tránh
  đọc nguyên file lớn khi chỉ cần 1 phần.
- Docs/file mới viết ra: ngắn gọn, ưu tiên bullet/bảng thay vì văn xuôi
  dài; không lặp lại nội dung đã có ở file khác — trỏ link thay vì copy.
- Không tự tạo file tổng hợp/báo cáo trung gian nếu không được yêu cầu.

## Tài liệu
- [`docs/architecture.md`](docs/architecture.md) — cấu trúc folder, nguyên
  tắc kiến trúc, SignalStore ↔ NgRx classic
- [`docs/coding-convention.md`](docs/coding-convention.md) — naming, DI,
  style component/template/signals
- [`docs/design-tokens.md`](docs/design-tokens.md) — ý nghĩa token màu/chữ
- [`docs/components.md`](docs/components.md) — component dùng chung
- Thiết kế UI đầy đủ (design system, token, component): Blueprint — [https://claude.ai/code/artifact/40b2d738-e4d7-45ea-8ae5-3e93abf46a28?via=auto_preview]
- Thiết kế từng màn hình (mockup: Main, FastGrowing, RecentShorts,
  SavedVideos, VideoDetail, Channels, ChannelsEmpty): Screens —
  [https://claude.ai/code/artifact/94ecf789-930b-4515-be6c-b354c5ceb642]
  (bản Material 3; bản PrimeNG cũ dạng design-canvas vẫn còn ở
  [https://claude.ai/code/artifact/e7696f33-ff84-4761-9a6d-373b3faff025])
- Tiến độ checklist: `ai/setup-base.md`

## Cách làm việc
- Đang làm gì / block ở đâu → [`ai/current.md`](ai/current.md) (lịch sử
  đã xong ở [`ai/history.md`](ai/history.md)).