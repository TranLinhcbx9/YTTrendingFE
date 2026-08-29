import { Component, computed, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Badge điểm trending trên thumbnail (mockup `.score`).
 *
 * `null` = chưa đủ 2 lần đồng bộ → hiện `—`, **không** hiện `0`
 * (`docs/components.md`). Ngưỡng màu heat theo mockup: <75 low, <86 mid,
 * còn lại high — heat cố tình lệch tông đỏ của `danger` (`docs/design-tokens.md`).
 */
@Component({
  selector: 'app-score-badge',
  imports: [MatTooltipModule],
  template: `<span
    class="inline-flex h-6 items-center rounded-full px-[9px] font-[family-name:var(--font-mono)] text-xs font-semibold"
    [class]="tone()"
    [matTooltip]="score() === null ? 'Chờ đủ 2 lần đồng bộ' : ''"
    >{{ score() ?? '—' }}</span
  >`,
})
export class ScoreBadge {
  readonly score = input<number | null>(null);

  protected readonly tone = computed(() => {
    const score = this.score();
    // Pending nằm trên thumbnail nên nền là scrim, không phải màu heat.
    if (score === null)
      return 'bg-[color-mix(in_srgb,var(--mat-sys-scrim)_45%,transparent)] text-[#e8efed]';
    if (score < 75)
      return 'bg-[color-mix(in_srgb,var(--color-heat-low)_22%,transparent)] text-[var(--color-heat-low)]';
    if (score < 86)
      return 'bg-[color-mix(in_srgb,var(--color-heat-mid)_22%,transparent)] text-[var(--color-heat-mid)]';
    return 'bg-[color-mix(in_srgb,var(--color-heat-high)_24%,transparent)] text-[var(--color-heat-high)]';
  });
}
