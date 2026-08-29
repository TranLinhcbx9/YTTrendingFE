import { Pipe, PipeTransform } from '@angular/core';

/** Giây → `"0:38"`. Shorts luôn < 1 giờ nên không cần nhánh `h:mm:ss`. */
@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  transform(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
