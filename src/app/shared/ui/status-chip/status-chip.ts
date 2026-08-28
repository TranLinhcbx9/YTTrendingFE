import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

type VideoStatus = 'New' | 'Tracking' | 'Archived';

@Component({
  selector: 'app-status-chip',
  imports: [MatChipsModule],
  template: `
    <mat-chip
      [class]="'status-chip status-chip--' + status().toLowerCase()"
      [disableRipple]="true"
    >
      @if (status() === 'Tracking') {
        <span class="status-chip__dot"></span>
      }
      {{ label() }}
    </mat-chip>
  `,
  styleUrl: './status-chip.css',
})
export class StatusChip {
  readonly status = input.required<VideoStatus>();

  protected readonly label = computed(
    () => ({ New: 'Mới', Tracking: 'Đang theo dõi', Archived: 'Lưu trữ' })[this.status()],
  );
}
