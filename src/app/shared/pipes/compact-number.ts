import { Pipe, PipeTransform } from '@angular/core';

/** `1204000` → `"1.2M"` — số liệu view/like/comment luôn rút gọn (`docs/design-tokens.md`). */
@Pipe({ name: 'compactNumber' })
export class CompactNumberPipe implements PipeTransform {
  private readonly formatter = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  });

  transform(value: number): string {
    return this.formatter.format(value);
  }
}
