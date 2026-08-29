import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { NotificationService } from '@core/ui/notification.service';
import { Channel } from '@shared/models/channel';
import { ConfirmDialog } from '@shared/ui/confirm-dialog/confirm-dialog';
import { RelativeTimePipe } from '@shared/pipes/relative-time';
import { ChannelsStore } from './channels.store';
import { extractYoutubeChannelId } from '@shared/data-access/channels.service';
import { ChannelEditDialog } from './channel-edit-dialog/channel-edit-dialog';

@Component({
  selector: 'app-channels-page',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    RelativeTimePipe,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './channels.html',
})
export class Channels {
  protected readonly store = inject(ChannelsStore);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  protected readonly newChannelInput = signal('');
  protected readonly displayedColumns = [
    'name',
    'url',
    'isEnabled',
    'lastSyncAt',
    'createdAt',
    'actions',
  ];

  protected initials(name: string): string {
    const words = name.trim().split(/\s+/);
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }

  protected displayUrl(url: string): string {
    return url.replace(/^https?:\/\/(www\.)?/, '');
  }

  protected async onAddSubmit(): Promise<void> {
    const raw = this.newChannelInput().trim();
    if (!raw) return;
    const id = extractYoutubeChannelId(raw);
    const ok = await this.store.addChannel(id);
    if (ok) {
      this.newChannelInput.set('');
      this.notification.success('Đã thêm kênh mới');
    }
    // Thất bại: lỗi hiện inline trong form (field-level hoặc `formErrorMessage`)
  }

  protected async onToggleEnabled(channel: Channel, event: MatSlideToggleChange): Promise<void> {
    const ok = await this.store.setChannelEnabled(channel, event.checked);
    if (ok) {
      this.notification.success(
        event.checked ? `Đã bật theo dõi "${channel.name}"` : `Đã tắt theo dõi "${channel.name}"`,
      );
    } else {
      this.notification.mutationError(this.store.actionError(), 'Cập nhật kênh thất bại');
    }
  }

  protected openEdit(channel: Channel): void {
    this.dialog.open(ChannelEditDialog, { data: channel, width: '28rem' });
  }

  protected onPageChange(event: PageEvent): void {
    this.store.setPage(event.pageIndex + 1);
  }

  protected async confirmDelete(channel: Channel): Promise<void> {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Xoá kênh',
        message: `Xoá kênh "${channel.name}"? Hành động này không thể hoàn tác.`,
        confirmLabel: 'Xoá',
        cancelLabel: 'Huỷ',
      },
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      const ok = await this.store.deleteChannel(channel.id);
      if (ok) {
        this.notification.success(`Đã xoá kênh "${channel.name}"`);
      } else {
        this.notification.mutationError(this.store.actionError(), 'Xoá kênh thất bại');
      }
    }
  }
}
