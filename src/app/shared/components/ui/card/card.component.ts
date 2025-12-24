import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',

  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      @if (title) {
        <div class="card-header">
          <h3 class="card-title">{{ title }}</h3>
          @if (subtitle) {
            <p class="card-subtitle">{{ subtitle }}</p>
          }
        </div>
      }
      <div class="card-content" [class.no-padding]="noPadding">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: var(--color-surface);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .card-elevated {
      box-shadow: var(--shadow-lg);
    }

    .card-outlined {
      border: 1px solid var(--color-border);
      box-shadow: none;
    }

    .card-header {
      padding: var(--spacing-4) var(--spacing-5);
      border-bottom: 1px solid var(--color-border);
    }

    .card-title {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .card-subtitle {
      margin: var(--spacing-1) 0 0;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .card-content {
      padding: var(--spacing-5);
    }

    .card-content.no-padding {
      padding: 0;
    }
  `]
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() variant: 'default' | 'elevated' | 'outlined' = 'default';
  @Input() noPadding = false;

  get cardClasses(): string {
    const classes = ['card'];
    if (this.variant !== 'default') classes.push(`card-${this.variant}`);
    return classes.join(' ');
  }
}
