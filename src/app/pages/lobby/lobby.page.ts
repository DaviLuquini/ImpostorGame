import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { CardComponent } from '@shared/components/ui/card/card.component';
import { AvatarComponent } from '@shared/components/ui/avatar/avatar.component';
import { GameActions } from '@state/game/game.actions';
import { GameSelectors } from '@state/game/game.selectors';

@Component({
  selector: 'app-lobby',

  imports: [ButtonComponent, CardComponent, AvatarComponent],
  template: `
    <div class="lobby-page">
      <header class="lobby-header">
        <button class="back-btn" (click)="goBack()">← Back</button>
        <h1>Lobby</h1>
      </header>

      <main class="lobby-content">
        <app-card title="Players Ready" [subtitle]="players().length + ' players'">
          <div class="player-grid">
            @for (player of players(); track player.id) {
              <div class="player-card">
                <app-avatar [name]="player.name" [color]="player.avatarColor" size="lg" />
                <span class="player-name">{{ player.name }}</span>
              </div>
            }
          </div>
        </app-card>

        <app-card title="Game Settings">
          <div class="settings-list">
            <div class="setting-item">
              <span class="setting-label">Mode</span>
              <span class="setting-value">{{ session()?.config?.mode || 'Classic' }}</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">Imposters</span>
              <span class="setting-value">{{ session()?.config?.imposterCount || 1 }}</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">Discussion Time</span>
              <span class="setting-value">{{ (session()?.config?.discussionTimeSeconds || 120) / 60 }} min</span>
            </div>
          </div>
        </app-card>
      </main>

      <footer class="lobby-footer">
        <app-button 
          variant="primary" 
          size="lg" 
          [block]="true"
          (click)="startGame()">
          🎮 Start Game
        </app-button>
      </footer>
    </div>
  `,
  styles: [`
    .lobby-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--color-background);
    }

    .lobby-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--color-border);
    }

    .lobby-header h1 {
      font-size: var(--font-size-xl);
      margin: 0;
      color: var(--color-text);
    }

    .back-btn {
      background: none;
      border: none;
      font-size: var(--font-size-base);
      color: var(--color-primary);
      cursor: pointer;
      padding: var(--spacing-2);
    }

    .lobby-content {
      flex: 1;
      padding: var(--spacing-4);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
      max-width: 500px;
      margin: 0 auto;
      width: 100%;
    }

    .player-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: var(--spacing-4);
    }

    .player-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2);
    }

    .player-name {
      font-size: var(--font-size-sm);
      color: var(--color-text);
      text-align: center;
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .settings-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-2) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .setting-label {
      color: var(--color-text-secondary);
    }

    .setting-value {
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      text-transform: capitalize;
    }

    .lobby-footer {
      padding: var(--spacing-4);
      border-top: 1px solid var(--color-border);
    }
  `]
})
export class LobbyPage {
  private router = inject(Router);

  players = GameSelectors.allPlayers;
  session = GameSelectors.session;

  goBack(): void {
    this.router.navigate(['/home']);
  }

  startGame(): void {
    GameActions.startGame();
    this.router.navigate(['/role-reveal']);
  }
}
