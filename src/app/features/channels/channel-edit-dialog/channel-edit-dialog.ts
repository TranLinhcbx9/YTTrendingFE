import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NotificationService } from '@core/ui/notification.service';
import { Channel } from '@shared/models/channel';
import { ClearableInput } from '@shared/ui/clearable-input/clearable-input';
import { ChannelsStore } from '../channels.store';

@Component({
  selector: 'app-channel-edit-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    ClearableInput,
  ],
  templateUrl: './channel-edit-dialog.html',
})
export class ChannelEditDialog {
  protected readonly store = inject(ChannelsStore);
  private readonly channel = inject<Channel>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ChannelEditDialog, boolean>);
  private readonly notification = inject(NotificationService);

  protected readonly name = signal(this.channel.name);
  protected readonly url = signal(this.channel.url);
  protected readonly isEnabled = signal(this.channel.isEnabled);

  protected async onSave(): Promise<void> {
    const ok = await this.store.updateChannel(this.channel.id, {
      name: this.name(),
      url: this.url(),
      isEnabled: this.isEnabled(),
    });
    if (ok) {
      this.notification.success(`Updated channel "${this.name()}"`);
      this.dialogRef.close(true);
    }
    // Failure: keep dialog open, error shows inline (field-level or `formErrorMessage`)
  }
}
