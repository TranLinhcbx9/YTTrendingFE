import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Khối "chưa có dữ liệu" dùng chung mọi màn hình/tab rỗng (`docs/components.md`). */
@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  template: `
    <div
      class="flex flex-col items-center gap-2 rounded-[var(--mat-sys-corner-large)] bg-[var(--color-surface)] px-6 py-14 text-center text-[var(--color-text-muted)]"
    >
      <mat-icon class="!h-11 !w-11 !text-[44px] opacity-70">{{ icon() }}</mat-icon>
      <span class="font-[family-name:var(--font-display)] text-base font-bold text-[var(--color-text)]">
        {{ title() }}
      </span>
      @if (message(); as msg) {
        <span>{{ msg }}</span>
      }
      <ng-content />
    </div>
  `,
})
export class EmptyState {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly message = input<string>();
}
