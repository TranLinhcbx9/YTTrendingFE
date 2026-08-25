# History — FE

> Việc đã xong, mới nhất trên đầu. Chi tiết đổi gì xem `git log`/`git show
> <hash>`. Đang làm/block hiện tại xem [`ai/current.md`](current.md).

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
