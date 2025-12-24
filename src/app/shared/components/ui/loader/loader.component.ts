import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',

  imports: [CommonModule],
  template: `
    <div class="loader" [class.loader-sm]="size === 'sm'" [class.loader-lg]="size === 'lg'">
      <div class="loader-spinner"></div>
      @if (text) {
        <span class="loader-text">{{ text }}</span>
      }
    </div>
  `,
  styles: [`
    .loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-3);
    }

    .loader-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .loader-sm .loader-spinner {
      width: 24px;
      height: 24px;
      border-width: 2px;
    }

    .loader-lg .loader-spinner {
      width: 56px;
      height: 56px;
      border-width: 4px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loader-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
  `]
})
export class LoaderComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() text?: string;
}
