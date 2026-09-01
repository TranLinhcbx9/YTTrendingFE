import { Component, input, output } from '@angular/core';

import { CompactNumberPipe } from '@shared/pipes/compact-number';
import { DurationPipe } from '@shared/pipes/duration';
import { RelativeTimePipe } from '@shared/pipes/relative-time';
import { Video } from '@shared/models/video';
import { ChannelAvatar } from '@shared/ui/channel-avatar/channel-avatar';
import { ScoreBadge } from '@shared/ui/score-badge/score-badge';
import { Sparkline } from '@shared/ui/sparkline/sparkline';
import { StatusChip } from '@shared/ui/status-chip/status-chip';

/**
 * 1 thẻ video dùng chung mọi tab danh sách — mockup Screens §Main/RecentShorts.
 *
 * `score`/`trendPoints`/`saved` là input riêng, không lấy từ `Video`: `VideoDto`
 * chưa có field điểm/snapshot/bookmark nào. Tab nào có dữ liệu (Trending, Fast
 * Growing, Saved) thì truyền vào; Recent Shorts để mặc định → badge hiện `—`
 * và footer hiện "chờ dữ liệu", đúng trạng thái pending mockup đã vẽ.
 */
@Component({
  selector: 'app-video-card',
  imports: [
    ChannelAvatar,
    CompactNumberPipe,
    DurationPipe,
    RelativeTimePipe,
    ScoreBadge,
    Sparkline,
    StatusChip,
  ],
  templateUrl: './video-card.html',
})
export class VideoCard {
  readonly video = input.required<Video>();

  /** Điểm trending; `null` = chưa đủ 2 lần đồng bộ. */
  readonly score = input<number | null>(null);

  /** Chuỗi view theo thời gian cho sparkline; rỗng = chưa có snapshot. */
  readonly trendPoints = input<number[]>([]);

  /** Tốc độ tăng view (mockup Fast Growing) — `null` thì không hiện dòng này. */
  readonly velocityPerHour = input<number | null>(null);

  /** Ghi chú ý tưởng (mockup Saved Videos). */
  readonly note = input<string | null>(null);

  readonly saved = input(false);

  /**
   * Bật nút bookmark. Mặc định tắt vì SavedIdeas chưa có API — nút vẫn hiện
   * đúng vị trí mockup nhưng ở trạng thái disabled, không phải nút giả bấm được.
   */
  readonly bookmarkEnabled = input(false);

  readonly bookmarkToggle = output<Video>();

  /** Mở trang Video Detail — cha điều hướng, VideoCard không tự biết route. */
  readonly open = output<Video>();
}
