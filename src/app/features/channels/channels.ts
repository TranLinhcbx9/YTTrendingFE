import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
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
import { ChannelAvatar } from '@shared/ui/channel-avatar/channel-avatar';
import { ConfirmDialog } from '@shared/ui/confirm-dialog/confirm-dialog';
import { EmptyState } from '@shared/ui/empty-state/empty-state';
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
    ChannelAvatar,
    EmptyState,
  ],
  templateUrl: './channels.html',
  styleUrl: './channels.css',
})
export class Channels {
  protected readonly store = inject(ChannelsStore);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
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

  /** Click channel name → opens the Dashboard already filtered to that channel. */
  protected viewVideos(channel: Channel): void {
    this.router.navigate(['/dashboard'], { queryParams: { channelIds: [channel.id] } });
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
      this.notification.success('New channel added');
    }
    // Failure: error shows inline in the form (field-level or `formErrorMessage`)
  }

  protected async onToggleEnabled(channel: Channel, event: MatSlideToggleChange): Promise<void> {
    const ok = await this.store.setChannelEnabled(channel, event.checked);
    if (ok) {
      this.notification.success(
        event.checked ? `Tracking enabled for "${channel.name}"` : `Tracking disabled for "${channel.name}"`,
      );
    } else {
      this.notification.mutationError(this.store.actionError(), 'Failed to update channel');
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
        title: `Delete channel ${channel.name}?`,
        message: 'All videos tracked from this channel will also be deleted. This action cannot be undone.',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        tone: 'danger',
      },
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      const ok = await this.store.deleteChannel(channel.id);
      if (ok) {
        this.notification.success(`Deleted channel "${channel.name}"`);
      } else {
        this.notification.mutationError(this.store.actionError(), 'Failed to delete channel');
      }
    }
  }
}
