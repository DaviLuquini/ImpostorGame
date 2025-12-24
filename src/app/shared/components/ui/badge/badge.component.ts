import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',

  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-1) var(--spacing-2);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      border-radius: var(--border-radius-full);
      min-width: 20px;
      min-height: 20px;
    }

    .badge-primary {
      background-color: var(--color-primary);
      color: var(--color-text-inverse);
    }

    .badge-secondary {
      background-color: var(--color-secondary);
      color: var(--color-text-inverse);
    }

    .badge-danger {
      background-color: var(--color-danger);
      color: var(--color-text-inverse);
    }

    .badge-success {
      background-color: var(--color-success);
      color: var(--color-text-inverse);
    }

    .badge-warning {
      background-color: var(--color-warning);
      color: var(--color-text);
    }

    .badge-outline {
      background-color: transparent;
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
    }
  `]
})
export class BadgeComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline' = 'primary';

  get badgeClasses(): string {
    return `badge badge-${this.variant}`;
  }
}
