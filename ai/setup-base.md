# Setup Base — Checklist (FE)

> Chỉ liệt kê *cái gì*, không nói *làm thế nào*.
> Chỉ tick khi đã code thật; base chưa đụng tới thì để trống, làm khi
> feature cần tới đó — có nhắc trước khi bắt tay.

## Base xong = 2 điều kiện
- `ng serve` lên được, mở `http://localhost:4200`
- Trang Channel Management gọi API backend thật: thêm 1 kênh (POST), thấy
  xuất hiện trong list (GET) — không mock

## 0. Chuyển PrimeNG → Angular Material 3
> Quyết định đổi UI lib sau khi base đã dựng bằng PrimeNG. Code từng batch
> (copy được) ở [`ai/temp/material-redesign-plan.md`](temp/material-redesign-plan.md).
> Các mục bên dưới đã bỏ tick chính là phần phải làm lại.

- [x] Batch 0–6: gỡ lib, dựng theme, tokens, `app.config.ts`, interceptor
- [x] Batch 7: Shell → nav rail + toolbar
- [~] Batch 8: `StatusChip` xong; các component còn lại ở mục 5
- [x] Batch 9: cập nhật docs (`AGENT.md`, `architecture.md`,
      `design-tokens.md`, `components.md`, file này)
- [x] Redesign artifact Blueprint + Screens sang M3

## 1. Khởi tạo dự án
- [x] `ng new` (standalone mặc định, `--style=css --routing --strict`, từ
      chối SSR khi CLI hỏi)
- [x] Gỡ `primeng` + `primeicons` + `@angular/animations`, cài
      `@angular/material@20.2.14` + `@angular/cdk@20.2.14`
- [x] Cài Tailwind CSS v4
- [x] Cài `@ngrx/signals`
- [x] ESLint (`@angular-eslint/schematics`) + Prettier

## 2. Styles / Token
- [x] `styles/_theme-colors.scss` — palette M3 generate từ seed `#2BD4C2`
      (máy sinh, không sửa tay)
- [x] `styles/material-theme.scss` — `mat.theme()` (color/typography/
      density −2) + `theme-overrides()` cho corner scale
- [x] `styles/tokens.css` — viết lại thành lớp alias trỏ vào `--mat-sys-*`
      (ý nghĩa ở `docs/design-tokens.md`)
- [x] `angular.json` — thêm `material-theme.scss` vào mảng `styles` (cả
      build lẫn test), trước `styles.css`
- [x] Thêm Google Fonts link (Be Vietnam Pro, Inter, JetBrains Mono) vào
      `index.html`
- [x] Thêm link Material Symbols Outlined + đăng ký
      `setDefaultFontSetClass` trong `app.config.ts`

## 3. Core
- [x] `environment.ts` / `environment.development.ts` —
      `apiBaseUrl: 'http://localhost:5118/api'`
- [x] `provideHttpClient()` trong `app.config.ts`
- [x] 1 `errorInterceptor` — map lỗi Result pattern (bảng ở
      `docs/architecture.md`) → `MatSnackBar`, đã gắn qua
      `withInterceptors([errorInterceptor])`

## 4. Layout
- [x] Global Shell component + routing — khung đã chạy
- [x] Dựng lại Shell theo M3: navigation rail 80dp (tự viết, Material
      không có) + `mat-toolbar` — theo Blueprint §03
- [x] `app.routes.ts` — lazy load từng feature (`loadComponent`)

## 5. Shared UI (Blueprint §02)
- [ ] `ScoreBadge`, `VideoCard`, `EmptyState`, `Sparkline` (`StatusChip` xong)
      (contract đầy đủ ở `docs/components.md`)
      *(`Pagination` đã bỏ — dùng `mat-paginator`)*
- [x] Pipe `relativeTime` — Channels cần nên làm sớm, xem `shared/pipes/relative-time.ts`
- [ ] Pipe `compactNumber` (1.2M) — chưa feature nào chạm tới

## 6. Slice nghiệm thu — Channel Management ✅
> CRUD đủ (List/Add/Edit/Toggle/Delete), đã verify tay với backend thật.
> `ng build` + `ng lint` pass.
- [x] `ChannelsService` — `GET`/`POST`/`PUT`/`DELETE /api/channels`, không
      giữ state. GET trả `Observable` (cho `rxResource`), mutation trả
      `Promise`
- [x] `ChannelsStore` (SignalStore) — gọi qua `ChannelsService`, dùng
      `withPagedResource` + `withMutationState` ở `shared/store/`
- [x] Trang list (`mat-table` + `mat-paginator`)
- [x] `ConfirmDialog` dùng chung trên `MatDialog` (Material không có sẵn)
- [x] Form Add — 1 ô nhập (Blueprint §06), gọi `POST /api/channels`
- [x] Verify tay: thêm kênh thật bằng Channel ID/URL thật → thấy row mới,
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