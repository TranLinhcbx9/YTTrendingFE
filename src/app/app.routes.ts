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
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
