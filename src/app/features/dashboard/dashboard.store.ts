import { computed, inject, resource } from '@angular/core';
import { signalStore, withComputed, withProps } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { ChannelsService } from '@shared/data-access/channels.service';
import { Video } from '@shared/models/video';
import { withPagedResource } from '@shared/store/with-paged-resource';
import { VideoListFilter, VideosService } from './dashboard.service';

/**
 * State trang Dashboard (tab Recent Shorts): danh sách video phân trang +
 * filter, kèm list kênh để đổ vào ô filter.
 *
 * Backend `GET /api/videos` **luôn** sort `PublishedAt` giảm dần (không có
 * param sort) — nên chính nó là "Recent Shorts", không cần `GetDashboardQuery`.
 */
export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withPagedResource<Video, VideoListFilter>(() => {
    const videos = inject(VideosService);
    return (params) => videos.getVideos(params);
  }),
  withProps(() => {
    const channels = inject(ChannelsService);
    return {
      // `resource()` chứ không phải `rxResource()`: load 1 lần lúc tạo store,
      // không có params đổi nên không có gì để huỷ giữa chừng.
      _channelOptions: resource({
        loader: () => firstValueFrom(channels.getChannels({ page: 1, pageSize: 100 })),
      }),
    };
  }),
  withComputed((store) => ({
    channelOptions: computed(() => store._channelOptions.value()?.items ?? []),
  })),
);
