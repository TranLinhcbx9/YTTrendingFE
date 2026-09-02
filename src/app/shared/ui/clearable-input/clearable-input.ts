import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

/**
 * `mat-form-field` + `matInput` với nút "x" clear khi có nội dung — Material
 * không có sẵn suffix này (`docs/components.md`). Dùng cho ô nhập text/number
 * đơn giản; ô search có autocomplete (`VideoFilterBar`) giữ code riêng vì
 * cấu trúc `matChipInputFor` khác hẳn.
 *
 * Generic theo `value` để `[(value)]` bind thẳng vào signal `string` (name,
 * url…) hoặc `number | null` (minViews…) mà không mất kiểu ở nơi gọi.
 */
@Component({
  selector: 'app-clearable-input',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './clearable-input.html',
  styleUrl: './clearable-input.css',
})
export class ClearableInput<T extends string | number | null = string> {
  readonly label = input<string>();
  readonly placeholder = input('');
  /** Cần khi không dùng `label` (nên không có `<mat-label>`) — vd field trong filter bar có label riêng bằng `<span>` ở ngoài. */
  readonly ariaLabel = input<string>();
  readonly type = input<'text' | 'number'>('text');
  readonly errorMessage = input<string | null>(null);

  readonly value = model.required<T>();

  protected clear(): void {
    this.value.set((this.type() === 'number' ? null : '') as T);
  }
}
