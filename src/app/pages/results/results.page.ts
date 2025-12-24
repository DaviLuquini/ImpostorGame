import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { AvatarComponent } from '@shared/components/ui/avatar/avatar.component';
import { GameActions } from '@state/game/game.actions';
import { GameSelectors } from '@state/game/game.selectors';
import { Team } from '@domain/models/role/team.enum';

@Component({
  selector: 'app-results',

  imports: [ButtonComponent, CardComponent, AvatarComponent],
  template: `
    <div class="results-page">
      @if (winner()) {
        <div class="winner-section">
          <div class="winner-emoji">
            @if (winner() === Team.Imposters) {
              😈
            } @else {
              😇
            }
          </div>
          <h1 class="winner-title">
            {{ winner() === Team.Imposters ? 'Imposters Win!' : 'Crewmates Win!' }}
          </h1>
        </div>

        <app-card title="The Imposters Were">
          <div class="reveal-grid">
            @for (player of imposters(); track player.id) {
              <div class="reveal-card imposter">
                <app-avatar [name]="player.name" [color]="player.avatarColor" size="lg" />
                <span class="player-name">{{ player.name }}</span>
                <span class="role-badge imposter">Imposter</span>
              </div>
            }
          </div>
        </app-card>

        <app-card title="Game Summary">
          <div class="summary-list">
            <div class="summary-item">
              <span>Total Rounds</span>
              <span class="value">{{ roundNumber() }}</span>
            </div>
            <div class="summary-item">
              <span>Players</span>
              <span class="value">{{ allPlayers().length }}</span>
            </div>
            <div class="summary-item">
              <span>Eliminated</span>
              <span class="value">{{ eliminatedPlayers().length }}</span>
            </div>
          </div>
        </app-card>

        <div class="action-buttons">
          <app-button variant="primary" size="lg" [block]="true" (click)="playAgain()">
            🔄 Play Again
          </app-button>
          <app-button variant="outline" [block]="true" (click)="goHome()">
            🏠 Home
          </app-button>
        </div>
      } @else {
        <div class="round-result">
          <h1>Round {{ roundNumber() }} Complete</h1>
          
          @if (lastEliminated()) {
            <app-card>
              <div class="eliminated-reveal">
                <app-avatar [name]="lastEliminated()!.name" [color]="lastEliminated()!.avatarColor" size="xl" [eliminated]="true" />
                <h2>{{ lastEliminated()!.name }} was eliminated</h2>
                <p class="role-reveal">
                  They were a 
                  <span [class.imposter]="lastEliminated()!.role?.isImposter()">
                    {{ lastEliminated()!.role?.name }}
                  </span>
                </p>
              </div>
            </app-card>
          } @else {
            <app-card>
              <div class="no-elimination">
                <p>No one was eliminated this round</p>
              </div>
            </app-card>
          }

          <app-button variant="primary" size="lg" [block]="true" (click)="continueGame()">
            Continue to Next Round
          </app-button>
        </div>
      }
    </div>
  `,
  styles: [`
    .results-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: var(--spacing-4);
      background-color: var(--color-background);
      gap: var(--spacing-4);
      max-width: 500px;
      margin: 0 auto;
    }

    .winner-section {
      text-align: center;
      padding: var(--spacing-8) 0;
    }

    .winner-emoji {
      font-size: 6rem;
      animation: bounce 0.5s ease-in-out infinite alternate;
    }

    @keyframes bounce {
      from { transform: translateY(0); }
      to { transform: translateY(-10px); }
    }

    .winner-title {
      font-size: var(--font-size-3xl);
      color: var(--color-text);
      margin: var(--spacing-4) 0 0;
    }

    .reveal-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: var(--spacing-4);
    }

    .reveal-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3);
      background: var(--color-surface-hover);
      border-radius: var(--border-radius);
    }

    .player-name {
      font-weight: var(--font-weight-medium);
      color: var(--color-text);
    }

    .role-badge {
      font-size: var(--font-size-xs);
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--border-radius-full);
      font-weight: var(--font-weight-bold);
    }

    .role-badge.imposter {
      background-color: var(--color-danger);
      color: white;
    }

    .summary-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-2) 0;
      border-bottom: 1px solid var(--color-border);
      color: var(--color-text);
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .summary-item .value {
      font-weight: var(--font-weight-bold);
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
      margin-top: var(--spacing-4);
    }

    .round-result {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
      text-align: center;
    }

    .round-result h1 {
      color: var(--color-text);
    }

    .eliminated-reveal {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-4);
    }

    .eliminated-reveal h2 {
      margin: 0;
      color: var(--color-text);
    }

    .role-reveal {
      color: var(--color-text-secondary);
    }

    .role-reveal .imposter {
      color: var(--color-danger);
      font-weight: var(--font-weight-bold);
    }

    .no-elimination {
      text-align: center;
      padding: var(--spacing-4);
      color: var(--color-text-secondary);
    }
  `]
})
export class ResultsPage {
  private router = inject(Router);

  Team = Team;
  allPlayers = GameSelectors.allPlayers;
  eliminatedPlayers = GameSelectors.eliminatedPlayers;
  imposters = GameSelectors.imposters;
  roundNumber = GameSelectors.roundNumber;
  winner = GameSelectors.winner;

  lastEliminated() {
    const eliminated = this.eliminatedPlayers();
    return eliminated[eliminated.length - 1] ?? null;
  }

  playAgain(): void {
    GameActions.resetGame();
    this.router.navigate(['/lobby']);
  }

  goHome(): void {
    GameActions.resetGame();
    this.router.navigate(['/']);
  }

  continueGame(): void {
    GameActions.startNewRound();
    GameActions.setPhase('discussion' as any);
    this.router.navigate(['/discussion']);
  }
}
