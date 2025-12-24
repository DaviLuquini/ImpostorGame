import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',

  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="onBackdropClick()">
        <div class="modal" [class.modal-sm]="size === 'sm'" [class.modal-lg]="size === 'lg'" (click)="$event.stopPropagation()">
          @if (title) {
            <div class="modal-header">
              <h2 class="modal-title">{{ title }}</h2>
              @if (showClose) {
                <button class="modal-close" (click)="close.emit()">×</button>
              }
            </div>
          }
          <div class="modal-body">
            <ng-content></ng-content>
          </div>
          @if (showFooter) {
            <div class="modal-footer">
              <ng-content select="[modal-footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-4);
      z-index: 1000;
      animation: fadeIn var(--transition-fast);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal {
      background-color: var(--color-surface);
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-xl);
      max-width: 90%;
      width: 400px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: slideUp var(--transition-base);
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .modal-sm { width: 320px; }
    .modal-lg { width: 600px; }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-4) var(--spacing-5);
      border-bottom: 1px solid var(--color-border);
    }

    .modal-title {
      margin: 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--color-text-secondary);
      cursor: pointer;
      padding: var(--spacing-1);
      line-height: 1;
    }

    .modal-close:hover {
      color: var(--color-text);
    }

    .modal-body {
      padding: var(--spacing-5);
      overflow-y: auto;
    }

    .modal-footer {
      padding: var(--spacing-4) var(--spacing-5);
      border-top: 1px solid var(--color-border);
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-3);
    }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showClose = true;
  @Input() showFooter = false;
  @Input() closeOnBackdrop = true;
  @Output() close = new EventEmitter<void>();

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.close.emit();
    }
  }
}
