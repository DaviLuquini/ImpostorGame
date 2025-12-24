import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameActions } from '@state/game/game.actions';
import { GameSelectors } from '@state/game/game.selectors';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

const ROSTER_STORAGE_KEY = 'saved_roster';
const CONFIG_STORAGE_KEY = 'saved_config';

interface SavedConfig {
  imposterCount: number;
}

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="config-page">
      <!-- TopAppBar -->
      <!-- TopAppBar -->
      <header class="settings-header">
        <button class="back-btn" (click)="goBack()">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>Settings</h1>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Headline: Configuration -->
        <div class="section-header">
          <h3>Game Settings</h3>
        </div>

        <!-- Player Count Card -->
        <div class="card">
          <div class="player-count-header">
            <div class="count-display">
              <span class="label">Total Players</span>
              <span class="value">{{ playerCount() }}</span>
            </div>
            <div class="count-controls">
              <button class="control-btn" (click)="adjustPlayerCount(-1)">
                <span class="material-symbols-outlined">remove</span>
              </button>
              <button class="control-btn primary" (click)="adjustPlayerCount(1)">
                <span class="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          <!-- Slider -->
          <div class="slider-container">
            <input 
              type="range" 
              class="range-slider" 
              min="3" 
              max="15" 
              [value]="playerCount()"
              (input)="onSliderChange($event)"
            >
            <div class="slider-track-bg">
              <div class="slider-fill" [style.width.%]="sliderPercentage()"></div>
            </div>
          </div>
          
          <div class="range-labels">
            <span>Min: 3</span>
            <span>Max: 15</span>
          </div>
        </div>

        <!-- Imposter Configuration -->
        <div class="card">
          <div class="imposter-header">
            <span class="label">Imposters</span>
            @if (imposterCount() >= 3) {
              <div class="risk-badge">
                <span class="material-symbols-outlined icon-xs">warning</span>
                <span>High Risk</span>
              </div>
            }
          </div>

          <!-- Segmented Buttons -->
          <div class="segmented-control">
            @for (count of [1, 2, 3]; track count) {
              <button 
                class="segment-btn" 
                [class.active]="imposterCount() === count"
                (click)="setImposterCount(count)">
                {{ count }}
              </button>
            }
          </div>
          <p class="helper-text">Recommended for {{ recommendedPlayers() }} players</p>
        </div>

        <div class="divider"></div>

        <!-- Headline: Roster -->
        <div class="roster-header">
          <h3>Roster ({{ roster().length }}/{{ playerCount() }})</h3>
          <button class="clear-btn" (click)="clearRoster()" [disabled]="roster().length === 0">Clear All</button>
        </div>

        <!-- Add Player Input -->
        <div class="add-player-input">
          <div class="input-icon">
            <span class="material-symbols-outlined">person_add</span>
          </div>
          <input 
            type="text" 
            placeholder="Enter player name..." 
            [(ngModel)]="newPlayerName"
            (keyup.enter)="addPlayer()"
            [disabled]="roster().length >= playerCount()"
          >
          <button class="add-btn" (click)="addPlayer()" [disabled]="!newPlayerName.trim() || roster().length >= playerCount()">
            <span class="material-symbols-outlined">add</span>
          </button>
        </div>

        <!-- Player List -->
        <div class="player-list">
          @for (player of roster(); track player.id) {
            <div class="player-item">
              <div class="player-info">
                <div class="avatar-circle" [style.background]="getGradient(player.name)">
                  {{ getInitials(player.name) }}
                </div>
                <span class="player-name">{{ player.name }}</span>
              </div>
              <button class="remove-btn" (click)="removePlayer(player.id)">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          }
        </div>
      </main>

      <!-- Fixed Footer -->
      <footer class="footer">
        <div class="footer-content">
          <button class="action-btn" (click)="saveAndStart()">
            <span>Save</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      background-color: var(--color-background);
      color: var(--color-text);
      font-family: var(--font-family, sans-serif);
    }

    .config-page {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      position: relative;
      background-color: var(--color-background);
    }

    /* Settings Header */
    .settings-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--color-border);
      background-color: var(--color-surface);
      position: sticky;
      top: 0;
      z-index: 20;
    }

    .settings-header h1 {
      font-size: var(--font-size-lg);
      margin: 0;
      color: var(--color-text);
      font-weight: 700;
    }

    .back-btn {
      background: none;
      border: none;
      color: var(--color-text);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-1);
      border-radius: var(--border-radius-full);
      transition: background-color var(--transition-fast);
      width: 40px;
      height: 40px;
    }

    .back-btn:hover {
      background-color: var(--color-surface-hover);
    }

    /* Main Content */
    .main-content {
      flex: 1;
      padding: var(--spacing-4);
      padding-top: var(--spacing-2);
      overflow-y: auto;
      padding-bottom: 120px; /* Footer space */
      max-width: 480px;
      margin: 0 auto;
      width: 100%;
    }

    .section-header {
      padding: var(--spacing-3) 0 var(--spacing-2);
    }

    .section-header h3 {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-secondary);
      font-weight: 700;
      margin: 0;
    }

    /* Cards */
    .card {
      background-color: var(--color-surface);
      border-radius: var(--border-radius-2xl);
      padding: var(--spacing-4);
      border: 1px solid var(--color-border);
      margin-bottom: var(--spacing-4);
      box-shadow: var(--shadow-sm);
    }

    /* Player Count */
    .player-count-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: var(--spacing-4);
    }

    .count-display {
      display: flex;
      flex-direction: column;
    }

    .count-display .label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
    }

    .count-display .value {
      font-size: 1.875rem;
      font-weight: 800;
      line-height: 1.2;
    }

    .count-controls {
      display: flex;
      gap: 8px;
      margin-bottom: 4px;
    }

    .control-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background-color: var(--color-surface-hover);
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .control-btn.primary {
      background-color: var(--color-primary);
      color: white;
      box-shadow: 0 4px 6px -1px rgba(32, 96, 223, 0.2);
    }

    .control-btn:active {
      transform: scale(0.95);
    }

    /* Slider */
    .slider-container {
      position: relative;
      width: 100%;
      height: 24px;
      display: flex;
      align-items: center;
    }

    .range-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 100%;
      background: transparent;
      position: absolute;
      z-index: 10;
      cursor: pointer;
    }

    .range-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background: var(--color-primary);
      cursor: pointer;
      margin-top: -10px; /* Adjust for track height */
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    /* Custom Track */
    .range-slider::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      cursor: pointer;
      background: transparent; 
    }

    .slider-track-bg {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 4px;
      background-color: #3d4452;
      border-radius: 2px;
      overflow: hidden;
      pointer-events: none;
    }

    .slider-fill {
      height: 100%;
      background-color: var(--color-primary);
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    /* Imposter Config */
    .imposter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-4);
    }

    .imposter-header .label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
    }

    .risk-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      background-color: rgba(245, 158, 11, 0.1); /* Amber 500/10 */
      color: var(--color-warning);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .icon-xs { font-size: 16px; }

    /* Segmented Control */
    .segmented-control {
      display: flex;
      padding: 4px;
      background-color: var(--color-background);
      border-radius: var(--border-radius-xl);
      gap: 4px;
    }

    .segment-btn {
      flex: 1;
      height: 40px;
      border: none;
      background: transparent;
      border-radius: var(--border-radius-lg);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .segment-btn.active {
      background-color: var(--color-surface);
      color: var(--color-text);
      box-shadow: var(--shadow-sm);
    }

    .helper-text {
      text-align: center;
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin-top: var(--spacing-3);
      margin-bottom: 0;
    }

    .divider {
      height: 1px;
      background-color: var(--color-border);
      margin: var(--spacing-6) 0;
    }

    /* Roster */
    .roster-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-3);
    }

    .roster-header h3 {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .clear-btn {
      background: none;
      border: none;
      color: var(--color-primary);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
    }

    .clear-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Add Player Input */
    .add-player-input {
      position: relative;
      margin-bottom: var(--spacing-4);
    }

    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-secondary);
      display: flex;
    }

    .add-player-input input {
      width: 100%;
      background-color: var(--color-surface);
      border: 1px solid transparent;
      border-radius: var(--border-radius-xl);
      padding: 14px 48px; /* space for icons */
      color: var(--color-text);
      outline: none;
      transition: all 0.2s;
    }

    .add-player-input input:focus {
      border-color: var(--color-primary);
      background-color: var(--color-surface-hover);
    }

    .add-btn {
      position: absolute;
      right: 8px;
      top: 8px;
      bottom: 8px;
      width: 36px;
      border: none;
      background-color: rgba(32, 96, 223, 0.1);
      color: var(--color-primary);
      border-radius: var(--border-radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .add-btn:hover:not(:disabled) {
      background-color: var(--color-primary);
      color: white;
    }

    .add-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Player List */
    .player-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: var(--spacing-4);
    }

    .player-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-xl);
      animation: fadeIn 0.3s ease-out;
    }

    .player-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 700;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .player-name {
      font-weight: 500;
    }

    .remove-btn {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      padding: 8px;
      border-radius: var(--border-radius-lg);
      cursor: pointer;
      display: flex;
    }

    .remove-btn:hover {
      background-color: rgba(239, 68, 68, 0.1);
      color: var(--color-danger);
    }

    /* Footer */
    .footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: var(--spacing-4);
      background: linear-gradient(to top, var(--color-background) 80%, transparent);
      pointer-events: none;
    }

    .footer-content {
      max-width: 480px;
      margin: 0 auto;
      pointer-events: auto;
    }

    .action-btn {
      width: 100%;
      height: 56px;
      background-color: var(--color-primary);
      color: white;
      border: none;
      border-radius: var(--border-radius-2xl);
      font-size: 1.125rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 8px 30px rgba(32, 96, 223, 0.3);
      transition: all 0.2s;
    }

    .action-btn:hover {
      background-color: var(--color-primary-light);
      box-shadow: 0 8px 35px rgba(32, 96, 223, 0.4);
    }

    .action-btn:active {
      transform: scale(0.98);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SettingsPage implements OnInit {
  private router = inject(Router);
  localStorage = inject(LocalStorageService);

  // State
  playerCount = signal(8);
  imposterCount = signal(2);
  roster = signal<{ id: string, name: string }[]>([]);
  newPlayerName = '';

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    // Load Roster
    const savedRoster = this.localStorage.get<{ id: string, name: string }[]>(ROSTER_STORAGE_KEY);
    if (savedRoster) {
      this.roster.set(savedRoster);
    }

    // Load Config
    const savedConfig = this.localStorage.get<SavedConfig>(CONFIG_STORAGE_KEY);
    if (savedConfig) {
      this.imposterCount.set(savedConfig.imposterCount);
      // We don't necessarily save player count preference separate from logic, 
      // but we could. For now let's keep it 8 or roster length driven.
    }
  }

  saveSettings() {
    this.localStorage.set(ROSTER_STORAGE_KEY, this.roster());
    this.localStorage.set(CONFIG_STORAGE_KEY, {
      imposterCount: this.imposterCount()
    });
  }

  goBack(): void {
    this.saveSettings(); // Auto-save on exit
    this.router.navigate(['/']);
  }

  adjustPlayerCount(delta: number) {
    const newCount = this.playerCount() + delta;
    if (newCount >= 3 && newCount <= 15) {
      this.playerCount.set(newCount);
    }
  }

  onSliderChange(event: any) {
    this.playerCount.set(Number(event.target.value));
  }

  sliderPercentage() {
    return ((this.playerCount() - 3) / (15 - 3)) * 100;
  }

  setImposterCount(count: number) {
    this.imposterCount.set(count);
  }

  recommendedPlayers() {
    // Simple logic for helper text
    if (this.imposterCount() === 1) return '3-7';
    if (this.imposterCount() === 2) return '8-10';
    return '11-15';
  }

  addPlayer() {
    const name = this.newPlayerName.trim();
    if (!name || this.roster().length >= this.playerCount()) return;

    this.roster.update(current => [
      ...current,
      { id: crypto.randomUUID(), name }
    ]);
    this.newPlayerName = '';
    this.saveSettings();
  }

  removePlayer(id: string) {
    this.roster.update(current => current.filter(p => p.id !== id));
    this.saveSettings();
  }

  clearRoster() {
    this.roster.set([]);
    this.saveSettings();
  }

  getInitials(name: string): string {
    return name.slice(0, 2).toUpperCase();
  }

  getGradient(name: string): string {
    // Simple deterministic gradient based on name length/char
    const hue1 = (name.length * 50) % 360;
    const hue2 = (hue1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 50%))`;
  }

  saveAndStart() {
    this.saveSettings();

    // Reset any existing game state
    GameActions.resetGame();

    // Create game session FIRST
    GameActions.createGame({
      imposterCount: this.imposterCount()
    });

    // THEN add all roster players to the game state
    this.roster().forEach(p => {
      GameActions.addPlayer(p.name);
    });

    this.router.navigate(['/lobby']);
  }
}
