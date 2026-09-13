import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRipple } from '@angular/material/core';
import { filter, map } from 'rxjs';

import { NotificationService } from '@core/ui/notification.service';
import { SyncHistoryStore } from '@features/sync-history/sync-history.store';

@Component({
  selector: 'app-shell',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatRipple,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);

  protected readonly syncHistoryStore = inject(SyncHistoryStore);

  protected readonly pageTitle = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.deepestTitle()),
    ),
    { initialValue: '' },
  );

  private deepestTitle(): string {
    let current = this.route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current.snapshot.data['title'] ?? '';
  }

  protected async startSync(): Promise<void> {
    const run = await this.syncHistoryStore.createSyncRun();
    if (run) {
      await this.router.navigate(['/sync-history', run.id]);
      return;
    }

    const error = this.syncHistoryStore.actionError();
    switch (error?.code) {
      case 'syncRun.inProgress':
        this.notification.error(
          'A Sync all run is already in progress. Wait for it to finish first.',
        );
        return;
      case 'syncRun.noEnabledChannels':
        this.notification.error('Enable at least one channel before starting a sync.');
        return;
      default:
        this.notification.mutationError(error, 'Could not start sync.');
    }
  }
}
