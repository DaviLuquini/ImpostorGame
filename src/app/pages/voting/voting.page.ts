import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { AvatarComponent } from '@shared/components/ui/avatar/avatar.component';
import { TimerComponent } from '@shared/components/ui/timer/timer.component';
import { GameActions } from '@state/game/game.actions';
import { GameSelectors } from '@state/game/game.selectors';
import { ResolveVotingUseCase } from '@domain/use-cases/voting/resolve-voting.use-case';

@Component({
  selector: 'app-voting',

  imports: [ButtonComponent, CardComponent, AvatarComponent, TimerComponent],
  template: `
    <div class="voting-page">
      <header class="voting-header">
        <h1>Voting Phase</h1>
        <app-timer 
          [seconds]="votingTime()"
          [totalSeconds]="votingTime()"
          [autoStart]="true"
          [showProgress]="false"
          (complete)="onTimerComplete()" />
      </header>

      <main class="voting-content">
        @if (!hasVoted()) {
          <p class="instruction">Select a player to eliminate</p>
          
          <div class="vote-options">
            @for (player of alivePlayers(); track player.id) {
              <button 
                class="vote-option"
                [class.selected]="selectedPlayerId() === player.id"
                (click)="selectPlayer(player.id)">
                <app-avatar [name]="player.name" [color]="player.avatarColor" />
                <span class="player-name">{{ player.name }}</span>
              </button>
            }
          </div>

          <app-button 
            variant="ghost" 
            [block]="true" 
            (click)="skipVote()"
            [class.selected-skip]="selectedPlayerId() === null && hasSelected()">
            Skip Vote
          </app-button>
        } @else {
          <app-card>
            <div class="vote-submitted">
              <span class="check-icon">✓</span>
              <h2>Vote Submitted</h2>
              <p>Waiting for all players to vote...</p>
            </div>
          </app-card>

          <div class="vote-progress">
            <span>{{ votesSubmitted() }} / {{ alivePlayers().length }} voted</span>
          </div>
        }
      </main>

      <footer class="voting-footer">
        @if (!hasVoted()) {
          <app-button 
            variant="primary" 
            size="lg" 
            [block]="true"
            [disabled]="!hasSelected()"
            (click)="submitVote()">
            Confirm Vote
          </app-button>
        } @else {
          <app-button 
            variant="primary" 
            size="lg" 
            [block]="true"
            (click)="proceedToResults()">
            Show Results
          </app-button>
        }
      </footer>
    </div>
  `,
  styles: [`
    .voting-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--color-background);
    }

    .voting-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--color-border);
    }

    .voting-header h1 {
      font-size: var(--font-size-xl);
      margin: 0;
      color: var(--color-text);
    }

    .voting-content {
      flex: 1;
      padding: var(--spacing-4);
      max-width: 500px;
      margin: 0 auto;
      width: 100%;
    }

    .instruction {
      text-align: center;
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-4);
    }

    .vote-options {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-4);
    }

    .vote-option {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3);
      background: var(--color-surface);
      border: 2px solid var(--color-border);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .vote-option:hover {
      border-color: var(--color-primary);
    }

    .vote-option.selected {
      border-color: var(--color-danger);
      background-color: rgba(231, 76, 60, 0.1);
    }

    .player-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--color-text);
    }

    .selected-skip {
      border: 2px solid var(--color-primary) !important;
    }

    .vote-submitted {
      text-align: center;
      padding: var(--spacing-6);
    }

    .check-icon {
      display: block;
      font-size: 3rem;
      color: var(--color-success);
      margin-bottom: var(--spacing-4);
    }

    .vote-submitted h2 {
      margin: 0 0 var(--spacing-2);
      color: var(--color-text);
    }

    .vote-submitted p {
      color: var(--color-text-secondary);
      margin: 0;
    }

    .vote-progress {
      text-align: center;
      margin-top: var(--spacing-4);
      color: var(--color-text-secondary);
    }

    .voting-footer {
      padding: var(--spacing-4);
      border-top: 1px solid var(--color-border);
    }
  `]
})
export class VotingPage {
  private router = inject(Router);

  alivePlayers = GameSelectors.alivePlayers;
  selectedPlayerId = signal<string | null>(undefined as any);
  hasVoted = signal(false);
  hasSelected = signal(false);

  votingTime(): number {
    return GameSelectors.session()?.config?.votingTimeSeconds ?? 60;
  }

  votesSubmitted(): number {
    return GameSelectors.voteCount();
  }

  selectPlayer(playerId: string): void {
    this.selectedPlayerId.set(playerId);
    this.hasSelected.set(true);
  }

  skipVote(): void {
    this.selectedPlayerId.set(null);
    this.hasSelected.set(true);
  }

  submitVote(): void {
    const currentPlayer = this.alivePlayers()[0];
    if (currentPlayer) {
      GameActions.castVote(currentPlayer.id, this.selectedPlayerId());
      this.hasVoted.set(true);
    }
  }

  onTimerComplete(): void {
    if (!this.hasVoted()) {
      this.skipVote();
      this.submitVote();
    }
  }

  proceedToResults(): void {
    const votes = GameSelectors.votes();
    const result = ResolveVotingUseCase.execute(votes);

    if (result.eliminatedPlayerId) {
      GameActions.eliminatePlayer(result.eliminatedPlayerId);
    }

    const session = GameSelectors.session();
    const winner = session?.checkWinCondition();

    if (winner) {
      session?.endGame(winner);
    }

    GameActions.setPhase('results' as any);
    this.router.navigate(['/results']);
  }
}
