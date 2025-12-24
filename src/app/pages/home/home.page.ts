import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '@state/theme/theme.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { GameActions } from '@state/game/game.actions';

const ROSTER_STORAGE_KEY = 'saved_roster';
const CONFIG_STORAGE_KEY = 'saved_config';

interface SavedConfig {
  imposterCount: number;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <!-- Background Effects -->
      <div class="bg-effects">
        <div class="grid-pattern"></div>
        <div class="glow-top-left"></div>
        <div class="glow-bottom-right"></div>
      </div>

      <!-- Main Content -->
      <div class="content-wrapper">
        <div class="spacer-top"></div>

        <!-- Center: Brand/Title -->
        <div class="brand-section">
          <!-- Logo Mark -->
          <div class="logo-group">
            <div class="logo-glow"></div>
            <div class="logo-container">
              <span class="material-symbols-outlined logo-icon">visibility_off</span>
            </div>
          </div>

          <!-- Text Content -->
          <div class="text-content">
            <h1 class="title">IMPOSTOR</h1>
            <div class="divider"></div>
            <p class="subtitle">
              Pass the phone.<br>
              Find the liar.
            </p>
          </div>
        </div>

        <!-- Bottom: Actions -->
        <div class="actions-section">
          <!-- New Game Button -->
          <button class="btn-new-game" (click)="startNewGame()">
            <div class="btn-shine"></div>
            <div class="btn-content">
              <span class="material-symbols-outlined icon-play">play_circle</span>
              <span class="btn-text">New Game</span>
            </div>
          </button>

          <!-- Themes Button -->
          <button class="btn-secondary" (click)="goToThemes()">
            <div class="btn-content">
              <span class="material-symbols-outlined icon-sm">palette</span>
              <span class="btn-text">Themes</span>
            </div>
          </button>

          <!-- Settings Button -->
          <button class="btn-secondary" (click)="goToSettings()">
            <div class="btn-content">
              <span class="material-symbols-outlined icon-sm">tune</span>
              <span class="btn-text">Settings</span>
            </div>
          </button>

          <!-- Version Info -->
          <div class="version-info">
            <p>VERSION 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      width: 100%;
      background-color: var(--color-background);
      overflow: hidden;
      position: relative;
    }

    .home-container {
      position: relative;
      height: 100%;
      min-height: 100vh;
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    /* --- Background Effects --- */
    .bg-effects {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      opacity: 0.6;
    }

    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 24px 24px;
      opacity: 0.1;
    }

    .glow-top-left {
      position: absolute;
      top: -20%;
      left: -10%;
      width: 80vw;
      height: 80vw;
      border-radius: 50%;
      background-color: rgba(32, 96, 223, 0.2); /* Primary color */
      filter: blur(80px);
    }

    .glow-bottom-right {
      position: absolute;
      bottom: -10%;
      right: -20%;
      width: 70vw;
      height: 70vw;
      border-radius: 50%;
      background-color: rgba(139, 92, 246, 0.1); /* Purple accent */
      filter: blur(100px);
    }

    /* --- Content Layout --- */
    .content-wrapper {
      position: relative;
      z-index: 10;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-6) var(--spacing-6) var(--spacing-8);
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    }

    .spacer-top {
      height: 40px;
      flex: 0 0 auto;
    }

    /* --- Brand Section --- */
    .brand-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-8);
      animation: fadeIn 0.8s ease-out;
    }

    .logo-group {
      position: relative;
      cursor: default;
    }

    .logo-group:hover .logo-glow {
      transform: scale(1.1);
    }

    .logo-group:hover .logo-icon {
      transform: rotate(12deg);
    }

    .logo-glow {
      position: absolute;
      inset: 0;
      background-color: rgba(32, 96, 223, 0.4);
      border-radius: var(--border-radius-2xl);
      filter: blur(24px);
      transition: transform 0.5s ease;
    }

    .logo-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 96px;
      height: 96px;
      border-radius: var(--border-radius-2xl);
      background: linear-gradient(135deg, var(--color-surface), var(--color-background));
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo-icon {
      font-size: 40px;
      color: var(--color-primary);
      transition: transform 0.5s ease;
    }

    .text-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
      align-items: center;
    }

    .title {
      font-family: 'Manrope', sans-serif;
      font-weight: 900;
      font-size: 40px;
      line-height: 1.1;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--color-text);
      margin: 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    @media (min-width: 768px) {
      .title {
        font-size: 48px;
        letter-spacing: 0.2em;
      }
    }

    .divider {
      height: 4px;
      width: 48px;
      background-color: var(--color-primary);
      border-radius: var(--border-radius-full);
      opacity: 0.8;
    }

    .subtitle {
      font-size: 1rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      line-height: 1.5;
      margin: 0;
      max-width: 260px;
    }

    /* --- Actions Section --- */
    .actions-section {
      width: 100%;
      max-width: 380px;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
      flex: 0 0 auto;
    }

    /* New Game Button */
    .btn-new-game {
      position: relative;
      width: 100%;
      height: 56px;
      border-radius: var(--border-radius-xl);
      background-color: var(--color-primary);
      color: #ffffff;
      border: none;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(32, 96, 223, 0.25);
      transition: all 0.2s ease;
      margin-bottom: var(--spacing-2);
    }

    .btn-new-game:hover {
      background-color: var(--color-primary-light);
      transform: translateY(-1px);
    }

    .btn-new-game:active {
      transform: scale(0.98);
    }

    .btn-shine {
      position: absolute;
      inset: 0;
      background-color: rgba(255, 255, 255, 0.1);
      opacity: 0;
      transition: opacity 0.2s;
    }

    .btn-new-game:hover .btn-shine {
      opacity: 1;
    }

    .btn-content {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      height: 100%;
    }

    .btn-text {
      font-size: 1.125rem; /* 18px */
      font-weight: 700;
      letter-spacing: 0.025em;
    }

    .icon-play {
      font-size: 24px;
    }

    /* Secondary Buttons (Themes, Settings) */
    .btn-secondary {
      width: 100%;
      height: 48px;
      border-radius: var(--border-radius-xl);
      background-color: var(--color-surface);
      color: var(--color-text-secondary);
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background-color: var(--color-surface-hover);
      color: var(--color-text);
    }

    .btn-secondary:active {
      transform: scale(0.98);
    }

    .btn-secondary .btn-text {
      font-size: 1rem;
    }

    .icon-sm {
      font-size: 20px;
    }

    /* Version Info */
    .version-info {
      padding-top: var(--spacing-4);
      text-align: center;
    }

    .version-info p {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      opacity: 0.6;
      letter-spacing: 0.05em;
      margin: 0;
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HomePage {
  private router = inject(Router);
  private localStorage = inject(LocalStorageService);
  themeService = inject(ThemeService);

  startNewGame(): void {
    // Load saved roster and config from LocalStorage
    const savedRoster = this.localStorage.get<{ id: string, name: string }[]>(ROSTER_STORAGE_KEY);
    const savedConfig = this.localStorage.get<SavedConfig>(CONFIG_STORAGE_KEY);

    // Check if there's a valid roster to start the game
    if (!savedRoster || savedRoster.length < 3) {
      // Not enough players saved, redirect to settings to configure
      this.router.navigate(['/settings']);
      return;
    }

    // Reset any existing game state
    GameActions.resetGame();

    // Create game session FIRST (so addPlayer can link to session)
    GameActions.createGame({
      imposterCount: savedConfig?.imposterCount ?? 1
    });

    // THEN add all saved players
    savedRoster.forEach(p => {
      GameActions.addPlayer(p.name);
    });

    // Navigate to lobby to start the game
    this.router.navigate(['/lobby']);
  }

  goToThemes(): void {
    this.router.navigate(['/themes']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}

