import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',

  imports: [CommonModule],
  template: `
    <div class="progress" [class.progress-sm]="size === 'sm'">
      <div 
        class="progress-bar" 
        [class]="'progress-bar-' + variant"
        [style.width.%]="progress">
      </div>
    </div>
  `,
  styles: [`
    .progress {
      width: 100%;
      height: 8px;
      background-color: var(--color-border);
      border-radius: var(--border-radius-full);
      overflow: hidden;
    }

    .progress-sm {
      height: 4px;
    }

    .progress-bar {
      height: 100%;
      border-radius: var(--border-radius-full);
      transition: width var(--transition-slow);
    }

    .progress-bar-primary {
      background-color: var(--color-primary);
    }

    .progress-bar-secondary {
      background-color: var(--color-secondary);
    }

    .progress-bar-success {
      background-color: var(--color-success);
    }

    .progress-bar-danger {
      background-color: var(--color-danger);
    }
  `]
})
export class ProgressBarComponent {
  @Input() progress = 0;
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' = 'md';
}
