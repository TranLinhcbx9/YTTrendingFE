import { Component, computed, input } from '@angular/core';

/**
 * Đường tăng trưởng mini trên `VideoCard` (mockup `.vfoot svg`, 46×18).
 * SVG polyline thuần — không dùng thư viện chart vì mỗi trang có hàng chục card.
 */
@Component({
  selector: 'app-sparkline',
  template: `<svg
    [attr.width]="width"
    [attr.height]="height"
    [attr.viewBox]="'0 0 ' + width + ' ' + height"
    aria-hidden="true"
  >
    <polyline
      [attr.points]="polyline()"
      fill="none"
      stroke="var(--color-status-tracking)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>`,
})
export class Sparkline {
  readonly points = input.required<number[]>();

  protected readonly width = 46;
  protected readonly height = 18;

  protected readonly polyline = computed(() => {
    const values = this.points();
    const max = Math.max(...values);
    const min = Math.min(...values);
    const span = max - min || 1;
    const stepX = values.length > 1 ? this.width / (values.length - 1) : 0;
    // Chừa 2px trên/dưới cho stroke-width 2 khỏi bị cắt ở mép viewBox.
    const usableHeight = this.height - 4;

    return values
      .map((value, index) => {
        const y = 2 + usableHeight - ((value - min) / span) * usableHeight;
        return `${(index * stepX).toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });
}
