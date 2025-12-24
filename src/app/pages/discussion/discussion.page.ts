import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { AvatarComponent } from '@shared/components/ui/avatar/avatar.component';
import { TimerComponent } from '@shared/components/ui/timer/timer.component';
import { GameActions } from '@state/game/game.actions';
import { GameSelectors } from '@state/game/game.selectors';

@Component({
  selector: 'app-discussion',

  imports: [ButtonComponent, CardComponent, AvatarComponent, TimerComponent],
  template: `
    <div class="discussion-page">
      <header class="discussion-header">
        <h1>Discussion Phase</h1>
        <span class="round-badge">Round {{ roundNumber() }}</span>
      </header>

      <main class="discussion-content">
        <app-card class="timer-card">
          <app-timer 
            [seconds]="discussionTime()"
            [totalSeconds]="discussionTime()"
            [autoStart]="true"
            size="lg"
            label="Discussion Time"
            (complete)="onTimerComplete()" />
        </app-card>

        <app-card title="Players" [subtitle]="alivePlayers().length + ' alive'">
          <div class="player-grid">
            @for (player of allPlayers(); track player.id) {
              <div class="player-cell" [class.eliminated]="!player.isAlive()">
                <app-avatar 
                  [name]="player.name" 
                  [color]="player.avatarColor" 
                  [eliminated]="!player.isAlive()"
                  [showStatus]="true" />
                <span class="player-name">{{ player.name }}</span>
                @if (!player.isAlive()) {
                  <span class="status-text">Eliminated</span>
                }
              </div>
            }
          </div>
        </app-card>
      </main>

      <footer class="discussion-footer">
        <app-button 
          variant="primary" 
          size="lg" 
          [block]="true"
          (click)="goToVoting()">
          ⚖️ Proceed to Voting
        </app-button>
      </footer>
    </div>
  `,
  styles: [`
    .discussion-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--color-background);
    }

    .discussion-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--color-border);
    }

    .discussion-header h1 {
      font-size: var(--font-size-xl);
      margin: 0;
      color: var(--color-text);
    }

    .round-badge {
      background-color: var(--color-primary);
      color: var(--color-text-inverse);
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--border-radius-full);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
    }

    .discussion-content {
      flex: 1;
      padding: var(--spacing-4);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
      max-width: 500px;
      margin: 0 auto;
      width: 100%;
    }

    .timer-card {
      text-align: center;
    }

    .player-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: var(--spacing-4);
    }

    .player-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-1);
    }

    .player-cell.eliminated {
      opacity: 0.6;
    }

    .player-name {
      font-size: var(--font-size-sm);
      color: var(--color-text);
      text-align: center;
    }

    .status-text {
      font-size: var(--font-size-xs);
      color: var(--color-danger);
    }

    .tips-section {
      padding: var(--spacing-4);
      background-color: var(--color-surface);
      border-radius: var(--border-radius);
    }

    .tips-section h3 {
      margin: 0 0 var(--spacing-2);
      font-size: var(--font-size-base);
      color: var(--color-text);
    }

    .tips-section ul {
      margin: 0;
      padding-left: var(--spacing-5);
      color: var(--color-text-secondary);
    }

    .tips-section li {
      padding: var(--spacing-1) 0;
    }

    .discussion-footer {
      padding: var(--spacing-4);
      border-top: 1px solid var(--color-border);
    }
  `]
})
export class DiscussionPage {
  private router = inject(Router);

  allPlayers = GameSelectors.allPlayers;
  alivePlayers = GameSelectors.alivePlayers;
  roundNumber = GameSelectors.roundNumber;

  discussionTime(): number {
    return GameSelectors.session()?.config?.discussionTimeSeconds ?? 120;
  }

  onTimerComplete(): void {
    this.goToVoting();
  }

  goToVoting(): void {
    GameActions.setPhase('voting' as any);
    this.router.navigate(['/voting']);
  }
}
