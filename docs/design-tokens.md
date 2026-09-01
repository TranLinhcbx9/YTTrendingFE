# Design Tokens — ý nghĩa

Nguồn thiết kế: Blueprint §01. Hệ màu là **Material 3**, palette generate
từ seed teal `#2BD4C2`.

## 3 tầng, mỗi tầng 1 file

| Tầng | File | Sửa được không |
|---|---|---|
| Palette (6 palette × 15+ tone) | `styles/_theme-colors.scss` | **Không** — máy sinh |
| M3 role (`--mat-sys-*`) | `styles/material-theme.scss` | Chỉ qua `mat.theme()` / `theme-overrides()` |
| Alias ngữ nghĩa của app (`--color-*`) | `styles/tokens.css` | Có — nguồn duy nhất cho màu app |

Sinh lại palette khi đổi màu thương hiệu:

```bash
ng generate @angular/material:theme-color --primary-color="#2BD4C2" \
  --directory="src/styles/" --is-scss=true
```

M3 không nhận 1 mã hex rồi tự xoay màu lúc chạy — nó cần đủ 6 palette và
ánh xạ *role* vào *tone*. Vì vậy đổi màu = generate lại, không sửa tay.

## Bảng alias — dùng token nào khi nào

| Token app | M3 role | Dùng khi nào |
|---|---|---|
| `--color-bg` | `background` | Nền toàn trang |
| `--color-surface` | `surface-container-low` | Nền card/panel |
| `--color-surface-2` | `surface-container` | Hover, header bảng |
| `--color-border` | `outline-variant` | Đường kẻ |
| `--color-border-strong` | `outline` | Viền input, viền nhấn |
| `--color-text` | `on-surface` | Chữ chính |
| `--color-text-muted` | `outline` | Chữ phụ — **xem cảnh báo dưới** |
| `--color-accent` | `primary` | Hành động chính, FAB, nav |
| `--color-accent-contrast` | `on-primary` | Chữ/icon trên nền accent |
| `--color-accent-soft` | `primary-container` | Nền nhấn dịu |
| `--color-danger` | `error` | Lỗi, hành động xoá |

> **Đừng dùng `on-surface-variant` cho chữ phụ.** Trong Angular Material
> 20, role này ở dark map vào `neutral-variant 90` = `#d6e6e2` — gần như
> trùng `on-surface` (`#dde4e1`), chữ "phụ" sẽ không hề phụ. Role đúng là
> `outline`: `#6b7a77` sáng / `#859490` tối.

## Extended color — M3 không có role tương ứng

`--color-status-new/-tracking/-archived` và `--color-heat-low/mid/high`
không map vào role M3 nào: M3 chỉ có primary/secondary/tertiary/error, mà
`error` đã dành cho `--color-danger`. M3 gọi đây là *custom color* và cho
phép khai riêng — khai bằng `light-dark()` cho khớp cơ chế Material.

Heat (ngả cam) và danger (đỏ thuần) **cố tình lệch tông** — để badge điểm
cao không bị đọc nhầm thành cảnh báo lỗi.

## Dark/light — 1 cơ chế duy nhất

`mat.theme()` để `theme-type` mặc định (`color-scheme`) nên Material emit
giá trị dạng `light-dark(sáng, tối)`. Đổi theme = đổi đúng thuộc tính CSS
`color-scheme`, **không** lặp lại bảng màu nhiều lần:

```css
:root { color-scheme: light dark; }          /* theo hệ điều hành */
:root[data-theme="light"] { color-scheme: light; }  /* toggle thắng */
:root[data-theme="dark"]  { color-scheme: dark; }
```

Dark là lựa chọn khi chưa có tín hiệu nào khác (dark-first).

## Type scale

M3 chia 2 slot font: **brand** (display / headline / title-large) và
**plain** (body / label / title-medium|small). Khai trong `mat.theme()`:

| Slot | Font | Token đọc ra |
|---|---|---|
| brand | Be Vietnam Pro | `--mat-sys-title-large-font` … |
| plain | Inter | `--mat-sys-body-medium-font` … |
| — | JetBrains Mono | `--font-mono` (app tự khai, M3 không có slot mono) |

M3 **không** có token `*-font-family` chung — chỉ có `<scale>-font` cho
từng bậc. `--font-display` / `--font-body` trong `tokens.css` trỏ vào
`title-large-font` / `body-medium-font`.

## Shape & density

| Token | M3 mặc định | Đang dùng | Lý do |
|---|---|---|---|
| `corner-small` | 8px | 8px | — |
| `corner-medium` | 12px | **10px** | Dashboard đọc số liệu, bớt tròn |
| `corner-large` | 16px | **12px** | nt |
| `corner-extra-large` | 28px | 28px | Bo góc chuẩn của dialog |
| density | 0 | **−2** | Row 56px → 40px |

Chỉnh qua `mat.theme-overrides()` và `density` trong `mat.theme()` — vẫn
nằm trong scale chính thức của M3, không phải hack. **Đừng chỉnh chiều
cao row/button bằng tay ở từng chỗ.**

## Breakpoint

`styles/tokens.css` khai 3 breakpoint riêng của app, **ghi đè** default
Tailwind (640/768/1024px) để khớp mốc M3 window-size class + rail↔drawer
ở Blueprint §Navigation:

| Token | Giá trị | Đang dùng ở |
|---|---|---|
| `--breakpoint-sm` | 600px | Rail 80dp (≥600px) ↔ hamburger + drawer (<600px, `layout/shell/`); filter bar thu gọn thành nút "Filters" (<600px, `video-filter-bar/`) |
| `--breakpoint-md` | 900px | Chưa có chỗ dùng — dự phòng theo mốc M3 |
| `--breakpoint-lg` | 1280px | Chưa có chỗ dùng — dự phòng theo mốc M3 |

> Grid card (Dashboard) **không** step theo breakpoint này — dùng
> `repeat(auto-fill, minmax(...))` co giãn liên tục theo bề rộng
> (`dashboard.css`), thay vì `grid-cols-2 sm:3 lg:4` đứng khựng ở từng
> mốc cột cố định (cách cũ, đã bỏ).

Cách áp breakpoint vào component (khi nào dùng Tailwind variant, khi nào
phải viết class + `@media` riêng): `docs/coding-convention.md` mục 11.

## Icon

**Material Symbols Outlined** (bộ của M3; Material Icons là bộ M2 cũ).
Là variable font nên chỉnh được `FILL`/`wght`: dùng `FILL: 1` cho mục
đang chọn thay vì chỉ đổi màu. Khai 1 lần:

```ts
inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
```

## Số liệu

View/like/comment là `BIGINT` — luôn rút gọn (`1,204,000 → 1.2M`). Áp
`font-variant-numeric: tabular-nums` ở mọi nơi số liệu xếp cột.

## Nội dung file thật

Xem `ai/temp/material-redesign-plan.md` Batch 1–3 (code đầy đủ, copy
được). Không chép lại ở đây để tránh 2 bản lệch nhau.
