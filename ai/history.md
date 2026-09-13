# History — FE

> Việc đã xong, mới nhất trên đầu. Chi tiết đổi gì xem `git log`/`git show
<hash>`. Đang làm/block hiện tại xem [`ai/current.md`](current.md).

- **2026-09-12** — Responsive UI: chuẩn hoá mobile filter cho Dashboard,
  Sync history và Sync run detail qua `app-filter-toolbar`. Dưới 600px,
  mỗi màn chỉ hiện nút `Filters` (kèm badge filter đang bật); bấm để
  mở/thu gọn field ngay bên dưới. Dashboard bỏ bottom sheet cũ.
  `ng build` và `ng lint` pass.

- **2026-09-12** — UI: chuẩn hoá filter multi-field theo Sync history. Thêm
  `app-filter-toolbar` cho Dashboard/Sync history; Dashboard dùng Material
  dropdown có label cho Time range/Status và Clear filters. Không thêm filter
  giả cho Channels (API hiện không có filter), Sync run giữ status strip.
  `ng build` và `ng lint` pass.

- **2026-09-11** — Sync history: thay native date input của Custom range bằng
  Material datepicker, giới hạn From/To tới ngày hiện tại và ràng buộc
  `From <= To`; serialize theo ngày đã chọn, không lệch timezone. `ng build`
  và `ng lint` pass.

- **2026-09-09** — Stitch/UX: chốt Global Sync all tạo một run rồi điều
  hướng ngay đến Sync run detail; tiến trình/lỗi batch rời khỏi Channels và
  nằm ở Sync history + detail (desktop/mobile). Bỏ các state batch cũ của
  Channels khỏi danh mục thiết kế chính thức.
- **2026-09-08** — Stitch: tạo ba mockup desktop-first cho luồng đồng bộ
  kênh (Đang đồng bộ, Hoàn tất có vấn đề, Bị gián đoạn), mỗi màn giữ riêng
  bảng snapshot sync và bảng quản lý kênh live; asset HTML/PNG ở
  `.stitch/designs/`. Các mockup này đã được thay thế và asset local đã xoá
  theo quyết định 2026-09-09 ở trên.
- **2026-09-06** — AI workflow: đổi nguồn hướng dẫn chung từ `AGENT.md`
  sang `AGENTS.md`; thêm adapter mỏng cho Claude/Gemini và quy ước độc lập
  nhà cung cấp.
- **2026-08-25** — Layout app: dựng Global Shell (`layout/shell`, khung
  sidebar/topbar) + `app.routes.ts` lazy load `dashboard`/`channels` qua
  `loadComponent`; xoá `app.html` monolithic cũ. (`06dc58f`)
- **2026-08-22** — Docs: cập nhật `AGENT.md`, thêm phần token control.
  (`c94803d`, `5715967`)
- **2026-08-22** — Core: wire `provideHttpClient()`, đồng bộ checklist
  `setup-base.md`. (`9d751c7`)
- **2026-08-22** — Setup base stack: `ng new` (standalone, strict), cài
  PrimeNG + PrimeIcons, Tailwind v4, `@ngrx/signals`, ESLint/Prettier;
  `styles/tokens.css` (`@theme` + light/dark), `environment.ts`
  (`apiBaseUrl`). (`f529d1a`)
- **2026-08-21** — Khởi tạo project. (`0f565d5`)
