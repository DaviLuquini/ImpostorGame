import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',

  imports: [CommonModule],
  template: `
    <div 
      class="avatar" 
      [class.avatar-sm]="size === 'sm'"
      [class.avatar-lg]="size === 'lg'"
      [class.avatar-xl]="size === 'xl'"
      [class.eliminated]="eliminated"
      [style.background-color]="color">
      <span class="avatar-initials">{{ initials }}</span>
      @if (showStatus) {
        <span class="avatar-status" [class.alive]="!eliminated" [class.dead]="eliminated"></span>
      }
    </div>
  `,
  styles: [`
    .avatar {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: var(--border-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      color: white;
      text-transform: uppercase;
      font-size: var(--font-size-base);
      box-shadow: var(--shadow);
      transition: all var(--transition-base);
    }

    .avatar-sm {
      width: 36px;
      height: 36px;
      font-size: var(--font-size-sm);
    }

    .avatar-lg {
      width: 64px;
      height: 64px;
      font-size: var(--font-size-xl);
    }

    .avatar-xl {
      width: 96px;
      height: 96px;
      font-size: var(--font-size-3xl);
    }

    .avatar.eliminated {
      opacity: 0.5;
      filter: grayscale(1);
    }

    .avatar-initials {
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .avatar-status {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      border-radius: var(--border-radius-full);
      border: 2px solid var(--color-surface);
    }

    .avatar-status.alive {
      background-color: var(--color-success);
    }

    .avatar-status.dead {
      background-color: var(--color-danger);
    }
  `]
})
export class AvatarComponent {
  @Input() name = '';
  @Input() color = '#4A90E2';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() eliminated = false;
  @Input() showStatus = false;

  get initials(): string {
    return this.name
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('');
  }
}
