import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',

  imports: [CommonModule],
  template: `
    <button 
      [class]="buttonClasses" 
      [disabled]="disabled"
      [type]="type">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-5);
      font-family: var(--font-family);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      border-radius: var(--border-radius);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      min-height: 44px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: var(--color-text-inverse);
    }
    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-primary-hover);
      box-shadow: var(--shadow-md);
    }

    .btn-secondary {
      background-color: var(--color-secondary);
      color: var(--color-text-inverse);
    }
    .btn-secondary:hover:not(:disabled) {
      background-color: var(--color-secondary-hover);
      box-shadow: var(--shadow-md);
    }

    .btn-danger {
      background-color: var(--color-danger);
      color: var(--color-text-inverse);
    }
    .btn-danger:hover:not(:disabled) {
      background-color: var(--color-danger-hover);
      box-shadow: var(--shadow-md);
    }

    .btn-outline {
      background-color: transparent;
      color: var(--color-primary);
      border: 2px solid var(--color-primary);
    }
    .btn-outline:hover:not(:disabled) {
      background-color: var(--color-primary);
      color: var(--color-text-inverse);
    }

    .btn-ghost {
      background-color: transparent;
      color: var(--color-text);
    }
    .btn-ghost:hover:not(:disabled) {
      background-color: var(--color-surface-hover);
    }

    .btn-sm {
      padding: var(--spacing-2) var(--spacing-3);
      font-size: var(--font-size-sm);
      min-height: 36px;
    }

    .btn-lg {
      padding: var(--spacing-4) var(--spacing-6);
      font-size: var(--font-size-lg);
      min-height: 52px;
    }

    .btn-block {
      width: 100%;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() block = false;
  @Input() type: 'button' | 'submit' = 'button';

  get buttonClasses(): string {
    const classes = ['btn', `btn-${this.variant}`];
    if (this.size !== 'md') classes.push(`btn-${this.size}`);
    if (this.block) classes.push('btn-block');
    return classes.join(' ');
  }
}
