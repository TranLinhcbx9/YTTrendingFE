import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Shared layout for list filters. Individual controls stay native Material
 * fields/selects so each feature can keep its own API-specific behaviour.
 */
@Component({
  selector: 'app-filter-toolbar',
  imports: [MatButtonModule, MatIconModule],
  template: `
    @if (collapseOnMobile()) {
      <button
        matButton="outlined"
        type="button"
        class="filter-toolbar__mobile-trigger"
        [attr.aria-expanded]="mobileFiltersOpen()"
        (click)="toggleMobileFilters()"
      >
        <mat-icon>tune</mat-icon>
        Filters
        @if (activeFilterCount(); as count) {
          <span class="filter-toolbar__active-count">{{ count }}</span>
        }
      </button>
    }

    <div
      class="filter-toolbar"
      [class.filter-toolbar--stack-on-mobile]="stackOnMobile()"
      [class.filter-toolbar--collapse-on-mobile]="collapseOnMobile()"
      [class.filter-toolbar--open]="mobileFiltersOpen()"
      [attr.aria-label]="ariaLabel()"
    >
      <ng-content />
    </div>
  `,
  styleUrl: './filter-toolbar.css',
})
export class FilterToolbar {
  readonly ariaLabel = input.required<string>();
  readonly stackOnMobile = input(false);
  readonly collapseOnMobile = input(false);
  readonly activeFilterCount = input(0);

  protected readonly mobileFiltersOpen = signal(false);

  protected toggleMobileFilters(): void {
    this.mobileFiltersOpen.update((isOpen) => !isOpen);
  }
}
