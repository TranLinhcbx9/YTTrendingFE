import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Channel } from '@shared/models/channel';
import { VIDEO_STATUS_LABELS, VideoStatus } from '@shared/models/video';
import { toDebouncedSignal } from '@shared/utils/debounced-signal';
import { VideoListFilter } from '../dashboard.service';

@Component({
  selector: 'app-video-filter-bar',
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatTooltipModule,
  ],
  templateUrl: './video-filter-bar.html',
  styleUrl: './video-filter-bar.css',
})
export class VideoFilterBar {
  readonly channels = input.required<readonly Channel[]>();
  readonly filter = input.required<VideoListFilter>();

  readonly filterChange = output<Partial<VideoListFilter>>();

  protected readonly statuses = Object.entries(VIDEO_STATUS_LABELS) as [VideoStatus, string][];
  protected readonly searchChannel = signal('');

  protected readonly minViewsRaw = signal<number | null>(null);
  private readonly minViewsDebounced = toDebouncedSignal(this.minViewsRaw, 400);

  constructor() {
    // Chỉ emit khi giá trị đã settle (debounce) VÀ thực sự khác filter hiện tại —
    // tránh emit thừa lúc mount (debounced ban đầu trùng filter) hoặc khi gõ rồi xoá về giá trị cũ.
    effect(() => {
      const minViews = this.minViewsDebounced();
      if (minViews === (this.filter().minViews ?? null)) return;
      this.filterChange.emit({ minViews: minViews ?? undefined });
    });
  }

  /** Kênh đang chọn — lấy từ `filter()` để URL/query param là nguồn duy nhất. */
  protected readonly selected = computed(() => {
    const ids = new Set(this.filter().channelIds ?? []);
    return this.channels().filter((channel) => ids.has(channel.id));
  });

  protected readonly suggestions = computed(() => {
    const ids = new Set(this.filter().channelIds ?? []);
    const keyword = this.searchChannel().trim().toLowerCase();
    return this.channels().filter(
      (channel) => !ids.has(channel.id) && channel.name.toLowerCase().includes(keyword),
    );
  });

  protected onChannelAdd(event: MatAutocompleteSelectedEvent, input: HTMLInputElement): void {
    const channel = event.option.value as Channel;
    this.emitChannels([...(this.filter().channelIds ?? []), channel.id]);
    input.value = '';
    this.searchChannel.set('');
  }

  protected onChannelRemove(channel: Channel): void {
    this.emitChannels((this.filter().channelIds ?? []).filter((id) => id !== channel.id));
  }

  protected onStatusChange(status: VideoStatus | null): void {
    this.filterChange.emit({ status: status ?? undefined });
  }

  protected onTimeRangesChange(timeRanges: number | null): void {
    this.filterChange.emit({ timeRanges: timeRanges ?? undefined });
  }

  /** Bỏ chọn hết = không lọc: gửi `undefined` để service không đính param rỗng. */
  private emitChannels(channelIds: number[]): void {
    this.filterChange.emit({ channelIds: channelIds.length > 0 ? channelIds : undefined });
  }
}
