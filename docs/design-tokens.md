# Design Tokens — ý nghĩa

Giá trị thật nằm ở `styles/tokens.css` (nguồn duy nhất — sửa màu chỉ sửa ở
đó). File này chỉ giải thích *khi nào dùng token nào*. Nguồn gốc thiết kế:
Blueprint §01.

| Token | Dùng khi nào |
|---|---|
| `--color-bg` | Nền toàn trang |
| `--color-surface` | Nền card/panel |
| `--color-surface-2` | Nền hover/nested (row hover trong table) |
| `--color-accent` | Hành động chính, nav active, focus ring |
| `--color-status-new` / `-tracking` / `-archived` | StatusChip — 3 trạng thái vòng đời video |
| `--color-heat-low/mid/high` | ScoreBadge — điểm trending thấp→cao (KHÔNG dùng cho lỗi) |
| `--color-danger` | Lỗi/hành động phá huỷ (xoá) — tách biệt heat-high dù cùng tông ấm |

## Dark/light — 3 lớp

`tokens.css` viết theo 3 lớp (dark là base, đúng pattern Blueprint §01):
1. `@theme { --color-bg: ...dark... }` — mặc định.
2. `@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) {...light...} }` — theo hệ điều hành.
3. `:root[data-theme="light"]` / `:root[data-theme="dark"]` — toggle thủ công trong app thắng tất cả.

## `styles/tokens.css` — nội dung thật, copy nguyên khối

```css
@import "tailwindcss";

@theme {
  --color-bg: #0A0E13;
  --color-surface: #131A21;
  --color-surface-2: #1B242C;
  --color-border: #26313A;
  --color-border-strong: #37454F;
  --color-text: #E8EEF2;
  --color-text-muted: #8A97A3;
  --color-text-faint: #5C6873;
  --color-accent: #2BD4C2;
  --color-accent-contrast: #052420;
  --color-accent-soft: #12302C;
  --color-status-new: #5B9DF0;
  --color-status-tracking: #34D399;
  --color-status-archived: #6B7785;
  --color-heat-low: #C99A3E;
  --color-heat-mid: #E08A3E;
  --color-heat-high: #E2603F;
  --color-danger: #E5484D;

  --font-display: "Be Vietnam Pro", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    --color-bg: #F3F6F6;
    --color-surface: #FFFFFF;
    --color-surface-2: #E8EDED;
    --color-border: #D7E0E0;
    --color-border-strong: #C3CFCF;
    --color-text: #101820;
    --color-text-muted: #4B5860;
    --color-text-faint: #7C8890;
    --color-accent: #0E9C8E;
    --color-accent-contrast: #FFFFFF;
    --color-accent-soft: #DCF3F0;
    --color-status-new: #2E6FD1;
    --color-status-tracking: #10925F;
    --color-status-archived: #667583;
    --color-heat-low: #9C701A;
    --color-heat-mid: #A85A1A;
    --color-heat-high: #B5401E;
    --color-danger: #C22A2F;
  }
}

:root[data-theme="light"] {
  --color-bg: #F3F6F6; --color-surface: #FFFFFF; --color-surface-2: #E8EDED;
  --color-border: #D7E0E0; --color-border-strong: #C3CFCF;
  --color-text: #101820; --color-text-muted: #4B5860; --color-text-faint: #7C8890;
  --color-accent: #0E9C8E; --color-accent-contrast: #FFFFFF; --color-accent-soft: #DCF3F0;
  --color-status-new: #2E6FD1; --color-status-tracking: #10925F; --color-status-archived: #667583;
  --color-heat-low: #9C701A; --color-heat-mid: #A85A1A; --color-heat-high: #B5401E;
  --color-danger: #C22A2F;
}

:root[data-theme="dark"] {
  --color-bg: #0A0E13; --color-surface: #131A21; --color-surface-2: #1B242C;
  --color-border: #26313A; --color-border-strong: #37454F;
  --color-text: #E8EEF2; --color-text-muted: #8A97A3; --color-text-faint: #5C6873;
  --color-accent: #2BD4C2; --color-accent-contrast: #052420; --color-accent-soft: #12302C;
  --color-status-new: #5B9DF0; --color-status-tracking: #34D399; --color-status-archived: #6B7785;
  --color-heat-low: #C99A3E; --color-heat-mid: #E08A3E; --color-heat-high: #E2603F;
  --color-danger: #E5484D;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
}
```

Font thật (Google Fonts) — thêm vào `index.html`:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">
```