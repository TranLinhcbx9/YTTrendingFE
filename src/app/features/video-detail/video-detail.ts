import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DurationPipe } from '@shared/pipes/duration';
import { Video } from '@shared/models/video';
import { ChannelAvatar } from '@shared/ui/channel-avatar/channel-avatar';
import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { StatusChip } from '@shared/ui/status-chip/status-chip';

/**
 * TẠM — route `/videos/:id` chạy được (đọc lại `Video` cha gửi qua router
 * state lúc click, không tự fetch `GET /api/videos/{id}`). Refresh thẳng URL
 * này mất data vì router state không sống qua reload — thay bằng
 * `video-detail.store.ts` + `.service.ts` thật khi làm mục 8
 * (`ai/setup-base.md`), lúc đó component này đổi qua đọc `route.paramMap`.
 */
@Component({
  selector: 'app-video-detail',
  imports: [
    RouterLink,
    DecimalPipe,
    DurationPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    ChannelAvatar,
    EmptyState,
    StatusChip,
  ],
  templateUrl: './video-detail.html',
})
export class VideoDetail {
  private readonly router = inject(Router);

  private readonly video: Video | null =
    (this.router.getCurrentNavigation()?.extras.state?.['video'] as Video | undefined) ?? null;

  protected readonly store = {
    isLoading: () => false,
    loadError: () => this.video === null,
    video: () => this.video,
    // Không có gì để refetch (chưa có service thật) — lùi về Dashboard thay vì im lặng.
    reload: () => this.router.navigate(['/dashboard']),
  };
}
