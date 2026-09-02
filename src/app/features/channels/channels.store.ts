import { inject } from '@angular/core';
import { signalStore, withMethods, withProps } from '@ngrx/signals';

import { Channel } from '@shared/models/channel';
import { withMutationState } from '@shared/store/with-mutation-state';
import { withPagedResource } from '@shared/store/with-paged-resource';
import { ChannelsService } from '@shared/data-access/channels.service';

export const ChannelsStore = signalStore(
  { providedIn: 'root' },
  withPagedResource<Channel>(() => {
    const service = inject(ChannelsService);
    return (params) => service.getChannels(params);
  }),
  withMutationState(),
  withProps(() => ({
    _channelsService: inject(ChannelsService),
  })),
  withMethods((store) => ({
    async addChannel(youtubeHandle: string): Promise<boolean> {
      const ok = await store.runFormMutation(() => store._channelsService.createChannel(youtubeHandle));
      if (ok) store.resetToFirstPage();
      return ok;
    },

    async updateChannel(id: number, body: { name: string; url: string; isEnabled: boolean }): Promise<boolean> {
      const ok = await store.runFormMutation(() => store._channelsService.updateChannel(id, body));
      if (ok) store.reload();
      return ok;
    },

    /**
     * Bật/tắt theo dõi từ toggle trong bảng — đi làn *action* (không phải form)
     * để nút này chạy không làm disable lây form Add. Reload cả khi lỗi vì
     * `mat-slide-toggle` đã lật sẵn ở UI, phải lấy lại state thật từ server.
     */
    async setChannelEnabled(channel: Channel, isEnabled: boolean): Promise<boolean> {
      const ok = await store.runActionMutation(() =>
        store._channelsService.updateChannel(channel.id, {
          name: channel.name,
          url: channel.url,
          isEnabled,
        }),
      );
      store.reload();
      return ok;
    },

    async deleteChannel(id: number): Promise<boolean> {
      const ok = await store.runActionMutation(() => store._channelsService.deleteChannel(id));
      if (ok) store.reload();
      return ok;
    },
  })),
);
