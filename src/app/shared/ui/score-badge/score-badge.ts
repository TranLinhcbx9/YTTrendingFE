import { Component, computed, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Trending score badge on the thumbnail (mockup `.score`).
 *
 * `null` = not enough sync cycles yet (needs 2) → show `—`, **never** `0`
 * (`docs/components.md`). Heat color thresholds per mockup: <75 low, <86 mid,
 * else high — heat is intentionally offset from `danger`'s red tone
 * (`docs/design-tokens.md`).
 */
@Component({
  selector: 'app-score-badge',
  imports: [MatTooltipModule],
  template: `<span
    class="inline-flex h-6 items-center rounded-full px-[9px] font-[family-name:var(--font-mono)] text-xs font-semibold"
    [class]="tone()"
    [matTooltip]="score() === null ? 'Waiting for 2 sync cycles' : ''"
    >{{ score() ?? '—' }}</span
  >`,
})
export class ScoreBadge {
  readonly score = input<number | null>(null);

  protected readonly tone = computed(() => {
    const score = this.score();
    // Pending sits on the thumbnail so the background is a scrim, not a heat color.
    if (score === null)
      return 'bg-[color-mix(in_srgb,var(--mat-sys-scrim)_45%,transparent)] text-[#e8efed]';
    if (score < 75)
      return 'bg-[color-mix(in_srgb,var(--color-heat-low)_22%,transparent)] text-[var(--color-heat-low)]';
    if (score < 86)
      return 'bg-[color-mix(in_srgb,var(--color-heat-mid)_22%,transparent)] text-[var(--color-heat-mid)]';
    return 'bg-[color-mix(in_srgb,var(--color-heat-high)_24%,transparent)] text-[var(--color-heat-high)]';
  });
}
