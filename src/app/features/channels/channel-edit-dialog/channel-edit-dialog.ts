import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NotificationService } from '@core/ui/notification.service';
import { Channel } from '@shared/models/channel';
import { ChannelsStore } from '../channels.store';

@Component({
  selector: 'app-channel-edit-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
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
