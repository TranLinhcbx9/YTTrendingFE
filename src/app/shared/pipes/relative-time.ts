import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return 'Not synced yet';

    const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60_000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
}
