import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

import { VIDEO_STATUS_LABELS, VideoStatus } from '@shared/models/video';

@Component({
  selector: 'app-status-chip',
  imports: [MatChipsModule],
  template: `
    <mat-chip
      [class]="'status-chip status-chip--' + (knownStatus() ? status().toLowerCase() : 'unknown')"
      [disableRipple]="true"
    >
      <span class="status-chip__dot"></span>
      {{ label() }}
    </mat-chip>
  `,
  styleUrl: './status-chip.css',
})
export class StatusChip {
  // Backend can occasionally return a status outside the enum (bad seed data) —
  // the chip must still render instead of crashing the page, so the input type
  // isn't narrowed to `VideoStatus`.
  readonly status = input.required<VideoStatus>();

  protected readonly knownStatus = computed(() => this.status() in VIDEO_STATUS_LABELS);
  protected readonly label = computed(() => VIDEO_STATUS_LABELS[this.status()] ?? 'Unknown');
}
