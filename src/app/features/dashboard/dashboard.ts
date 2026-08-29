import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { VideoCard } from '@shared/ui/video-card/video-card';
import { VideoListFilter } from './dashboard.service';
import { DashboardStore } from './dashboard.store';
import { VideoFilterBar } from './video-filter-bar/video-filter-bar';

/**
 * Route `/dashboard` — tab Recent Shorts của mockup (3 tab còn lại
 * Trending/Fast Growing/Saved chưa có dữ liệu backend nên chưa dựng
 * `mat-tab-group`: dựng tab rỗng bây giờ là base thừa).
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTabsModule,
    EmptyState,
    VideoCard,
    VideoFilterBar,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  protected readonly store = inject(DashboardStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * Tab đang mở (mockup có 4 tab; chỉ Recent Shorts — index 2 — có dữ liệu).
   * Giữ ở local signal chứ không đưa vào store: 3 tab kia chưa gọi API nào.
   */
  protected readonly selectedTab = signal(2);

  constructor() {
    // Lối vào từ trang Channels (click tên kênh) mang sẵn `?channelIds=`.
    // Đọc 1 lần ở constructor là đủ: component bị huỷ/tạo lại mỗi lần điều
    // hướng giữa /channels ↔ /dashboard.
    const channelIds = this.route.snapshot.queryParamMap.getAll('channelIds').map(Number);
    if (channelIds.length > 0) {
      this.store.setFilter({ channelIds });
    }
  }

  protected onFilterChange(filter: Partial<VideoListFilter>): void {
    this.store.setFilter(filter);

    if ('channelIds' in filter) {
      const channelIds = filter.channelIds ?? [];
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: channelIds.length > 0 ? { channelIds } : {},
        replaceUrl: true,
      });
    }
  }

  protected onPageChange(event: PageEvent): void {
    this.store.setPage(event.pageIndex + 1);
  }
}
