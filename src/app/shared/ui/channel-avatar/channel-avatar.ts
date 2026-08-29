import { Component, computed, input } from '@angular/core';

/**
 * Avatar tròn 2 chữ cái đầu tên kênh — dùng ở bảng Channels và `VideoCard`
 * (Blueprint §Channels / §VideoCard). YouTube có avatar thật nhưng `ChannelDto`
 * chưa trả field ảnh nào, nên vẫn là initials cho tới khi backend có.
 */
@Component({
  selector: 'app-channel-avatar',
  template: `<span
    class="grid flex-none place-items-center rounded-full bg-[var(--color-accent)] font-bold text-[var(--color-accent-contrast)]"
    [style.width.px]="size()"
    [style.height.px]="size()"
    [style.fontSize.px]="size() / 2"
    aria-hidden="true"
    >{{ initials() }}</span
  >`,
})
export class ChannelAvatar {
  readonly name = input.required<string>();
  readonly size = input(18);

  protected readonly initials = computed(() => {
    const words = this.name().trim().split(/\s+/);
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : this.name().slice(0, 2).toUpperCase();
  });
}
