import { Component, Input, Output, EventEmitter, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer',

  imports: [CommonModule],
  template: `
    <div class="timer" [class.timer-danger]="isLow()" [class.timer-lg]="size === 'lg'">
      <div class="timer-display">
        <span class="timer-value">{{ formatted() }}</span>
        @if (showLabel) {
          <span class="timer-label">{{ label }}</span>
        }
      </div>
      @if (showProgress) {
        <div class="timer-progress">
          <div class="timer-progress-bar" [style.width.%]="progressPercent()"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .timer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2);
    }

    .timer-display {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .timer-value {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      font-variant-numeric: tabular-nums;
      transition: color var(--transition-fast);
    }

    .timer-lg .timer-value {
      font-size: 4rem;
    }

    .timer-danger .timer-value {
      color: var(--color-danger);
      animation: pulse 1s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .timer-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .timer-progress {
      width: 200px;
      height: 4px;
      background-color: var(--color-border);
      border-radius: var(--border-radius-full);
      overflow: hidden;
    }

    .timer-progress-bar {
      height: 100%;
      background-color: var(--color-primary);
      border-radius: var(--border-radius-full);
      transition: width 1s linear, background-color var(--transition-fast);
    }

    .timer-danger .timer-progress-bar {
      background-color: var(--color-danger);
    }
  `]
})
export class TimerComponent implements OnDestroy {
  @Input() seconds = 60;
  @Input() totalSeconds = 60;
  @Input() showLabel = true;
  @Input() label = 'remaining';
  @Input() showProgress = true;
  @Input() size: 'md' | 'lg' = 'md';
  @Input() dangerThreshold = 10;
  @Input() autoStart = false;
  @Output() complete = new EventEmitter<void>();
  @Output() tick = new EventEmitter<number>();

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private currentSeconds = signal(60);

  ngOnInit(): void {
    this.currentSeconds.set(this.seconds);
    if (this.autoStart) {
      this.start();
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }

  start(): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.currentSeconds.update(s => {
        const newValue = Math.max(0, s - 1);
        this.tick.emit(newValue);
        if (newValue === 0) {
          this.stop();
          this.complete.emit();
        }
        return newValue;
      });
    }, 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(seconds?: number): void {
    this.stop();
    this.currentSeconds.set(seconds ?? this.totalSeconds);
  }

  formatted(): string {
    const secs = this.currentSeconds();
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  }

  isLow(): boolean {
    return this.currentSeconds() <= this.dangerThreshold;
  }

  progressPercent(): number {
    return (this.currentSeconds() / this.totalSeconds) * 100;
  }
}
