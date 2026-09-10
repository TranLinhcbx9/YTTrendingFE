import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NotificationService } from '@core/ui/notification.service';
import { SyncHistoryStore } from './sync-history.store';

@Component({
  selector: 'app-sync-history-page',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './sync-history.html',
  styleUrl: './sync-history.css',
})
export class SyncHistory {
  protected readonly store = inject(SyncHistoryStore);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  protected async startSync(): Promise<void> {
    const run = await this.store.createSyncRun();
    if (run) {
      await this.router.navigate(['/sync-history', run.id]);
      return;
    }

    const error = this.store.actionError();
    if (error?.code !== 'syncRun.inProgress' && error?.code !== 'syncRun.noEnabledChannels') {
      this.notification.mutationError(error, 'Could not start sync.');
    }
  }
}
