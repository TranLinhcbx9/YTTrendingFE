import { Component, input } from '@angular/core';

/**
 * Shared layout for list filters. Individual controls stay native Material
 * fields/selects so each feature can keep its own API-specific behaviour.
 */
@Component({
  selector: 'app-filter-toolbar',
  template: `
    <div
      class="filter-toolbar"
      [class.filter-toolbar--stack-on-mobile]="stackOnMobile()"
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
}
