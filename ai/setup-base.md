# Setup Base — Checklist (FE)

> Chỉ liệt kê *cái gì*, không nói *làm thế nào*.
> Chỉ tick khi đã code thật; base chưa đụng tới thì để trống, làm khi
> feature cần tới đó — có nhắc trước khi bắt tay.

## Base xong = 2 điều kiện
- `ng serve` lên được, mở `http://localhost:4200`
- Trang Channel Management gọi API backend thật: thêm 1 kênh (POST), thấy
  xuất hiện trong list (GET) — không mock

## 1. Khởi tạo dự án
- [x] `ng new` (standalone mặc định, `--style=css --routing --strict`, từ
      chối SSR khi CLI hỏi)
- [x] Cài `primeng` + `primeicons`
- [x] Cài Tailwind CSS v4
- [x] Cài `@ngrx/signals`
- [x] ESLint (`@angular-eslint/schematics`) + Prettier

## 2. Styles / Token
- [x] `styles/tokens.css` — khai `@theme` + override light/dark 3 lớp
      (nội dung đầy đủ ở `docs/design-tokens.md`)
- [x] Import theme PrimeNG (Aura, qua `providePrimeNG` trong
      `app.config.ts`) + `tokens.css` vào `styles.css` gốc
- [x] Thêm Google Fonts link (Be Vietnam Pro, Inter, JetBrains Mono) vào
      `index.html`

## 3. Core
- [x] `environment.ts` / `environment.development.ts` —
      `apiBaseUrl: 'http://localhost:5118/api'`
- [x] `provideHttpClient()` trong `app.config.ts`
- [ ] 1 `errorInterceptor` — map lỗi Result pattern (bảng ở
      `docs/architecture.md`) → toast PrimeNG
      *(làm cùng lúc mục 6 — lúc chạm request API thật, chưa làm trước)*

## 4. Layout
- [ ] Global Shell component (sidebar 2 mục + top bar) — theo Blueprint §03
- [ ] `app.routes.ts` — lazy load từng feature (`loadComponent`)

## 5. Shared UI (Blueprint §02)
- [ ] `StatusChip`, `ScoreBadge`, `VideoCard`, `EmptyState`, `Pagination`,
      `Sparkline` (contract đầy đủ ở `docs/components.md`)
- [ ] Pipe: `compactNumber` (1.2M), `relativeTime`

## 6. Slice nghiệm thu — Channel Management
- [ ] `ChannelsStore` (SignalStore) — state + `httpResource()`/`resource()`
      gọi `GET /api/channels`
- [ ] Trang list (bảng, dùng `Pagination`)
- [ ] Form Add — 1 ô nhập (Blueprint §06), gọi `POST /api/channels`
- [ ] Verify tay: thêm kênh thật bằng Channel ID/URL thật → thấy row mới,
      `isEnabled`/`lastSyncAt` đúng dữ liệu backend trả

## 7. Dashboard — ⛔ chặn, chờ backend `GetDashboardQuery`
- [ ] `DashboardStore`
- [ ] Tab Recent Shorts trước (không cần snapshot)
- [ ] Tab Trending/Fast Growing (cần backend chạy ≥2 chu kỳ Metrics Update
      Job mới có dữ liệu thật)

## 8. Video Detail — ⛔ chặn, chờ backend `GetVideoDetailQuery`

## 9. Saved Ideas — ⛔ chặn, chờ backend SavedIdeas CRUD

---

## Hoãn sang sau
Test framework · SSR · i18n · PWA