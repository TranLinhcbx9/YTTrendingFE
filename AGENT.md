# Shorts Trend Monitor — FE (Phase 1)

## Mục tiêu
Giao diện Angular cho công cụ theo dõi kênh YouTube Shorts đối thủ, phát
hiện video tăng trưởng tốt để tham khảo ý tưởng content. Thiết kế UI chi
tiết (màu, component, từng màn hình): xem Blueprint — [link].

## Stack
- Angular (bản mới nhất khi tạo dự án), standalone components, Signals
- State: `@ngrx/signals` (SignalStore) — 1 store / feature
- Data fetching: `resource()` / `httpResource()`
- UI: PrimeNG + PrimeIcons
- Style: Tailwind CSS v4 (CSS-first config qua `@theme`)

## Invariant
- Base URL API: khai trong `environment.ts` — **1 nơi duy nhất**, không
  hardcode URL ở component/service khác.
- Màu/font: **1 nơi duy nhất** — `styles/tokens.css`. Component không tự
  khai hex/font riêng.
- VideoId (YouTube cấp) là khóa duy nhất so sánh video — không dùng
  title/thumbnail.
- ARCHIVED là trạng thái cuối — UI không có action đưa video quay lại
  TRACKING.
- Lỗi từ backend theo Result pattern (400 field-level / 404 / 409) — map
  theo đúng 1 bảng trong `docs/architecture.md`, không tự chế cách xử lý
  lỗi mới ở từng feature.

## Lệnh
- `ng serve` — dev server
- `ng build` — build production

## Quy ước
- 1 feature = 1 folder (`features/<name>/`), component + `*.store.ts` +
  models cạnh nhau.
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
- [`docs/design-tokens.md`](docs/design-tokens.md) — ý nghĩa token màu/chữ
- [`docs/components.md`](docs/components.md) — component dùng chung
- Thiết kế UI đầy đủ: Blueprint — [https://claude.ai/code/artifact/40b2d738-e4d7-45ea-8ae5-3e93abf46a28?via=auto_preview]
- Tiến độ: `ai/setup-base.md`