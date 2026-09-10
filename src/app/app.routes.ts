import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
        data: { title: 'Dashboard' },
      },
      {
        path: 'channels',
        loadComponent: () => import('./features/channels/channels').then((m) => m.Channels),
        data: { title: 'Channels' },
      },
      {
        path: 'sync-history',
        loadComponent: () => import('./features/sync-history/sync-history').then((m) => m.SyncHistory),
        data: { title: 'Sync history' },
      },
      {
        path: 'sync-history/:runId',
        loadComponent: () =>
          import('./features/sync-history/sync-run-detail/sync-run-detail').then((m) => m.SyncRunDetail),
        data: { title: 'Sync run' },
      },
      {
        path: 'videos/:id',
        loadComponent: () =>
          import('./features/video-detail/video-detail').then((m) => m.VideoDetail),
        data: { title: 'Video Detail' },
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
