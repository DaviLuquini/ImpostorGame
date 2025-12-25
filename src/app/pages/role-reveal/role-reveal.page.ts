import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameActions } from '@state/game/game.actions';
import { GameSelectors } from '@state/game/game.selectors';
import { CategoryService } from '@state/category/category.service';

@Component({
  selector: 'app-role-reveal',
  imports: [CommonModule],
  template: `
    <div class="role-reveal-page">
      <!-- Background Abstract Blob (Fixed) -->
      <div class="bg-blob"></div>

      <div class="mobile-container">
        <!-- Header / Progress -->
        <header class="header">
          <div class="progress-bar">
            @for (player of allPlayers(); track player.id; let i = $index) {
              <div class="progress-indicator" 
                   [class.active]="i === currentPlayerIndex()"
                   [class.completed]="i < currentPlayerIndex()">
              </div>
            }
          </div>
          <p class="progress-text">Player {{ currentPlayerIndex() + 1 }} of {{ totalPlayers() }}</p>
        </header>

        <!-- Main Content Area -->
        <main class="main-content">
          <!-- Context Text -->
          <div class="context-section" [class.fade-out]="isRevealed()">
            <h1 class="player-turn-title">
              {{ currentPlayer().name }}'s Turn
            </h1>
            <p class="instruction-text">
              Pass the device. Ensure no one is watching.
            </p>
          </div>

          <!-- Reveal Card Container -->
          <div class="card-container">
            <!-- Card Background / Shadow Glow -->
            <div class="card-glow"></div>

            <!-- The Interactive Card -->
            <div 
              class="interactive-card"
              (mousedown)="startReveal()"
              (touchstart)="startReveal()"
              (mouseup)="endReveal()"
              (touchend)="endReveal()"
              (mouseleave)="endReveal()"
            >
              
              <!-- HEADER IMAGE SECTION (Always visible top part) -->
              <div class="card-header-image">
                 <div class="abstract-pattern"></div>
                 <div class="gradient-overlay"></div>
                 <div class="visibility-badge">
                   <span class="material-symbols-outlined">visibility_off</span>
                 </div>
              </div>

              <!-- CONTENT SECTION (Changes based on Reveal) -->
              <div class="card-body">
                
                <!-- HIDDEN STATE: Fingerprint & Instructions -->
                <div class="state-hidden" [class.hidden]="isRevealed()">
                  <div class="fingerprint-circle">
                    <span class="material-symbols-outlined fingerprint-icon">fingerprint</span>
                  </div>
                  <h3 class="card-title">Tap to Reveal Identity</h3>
                  <p class="card-desc">
                    Hold your finger on the screen to see your secret role.
                  </p>
                </div>

                <!-- REVEALED STATE: Role Info -->
                <div class="state-revealed" [class.visible]="isRevealed()">
                   <p class="role-preheader">You are the</p>
                   <h2 class="role-name" [class.imposter]="isImposter()">
                     {{ getRoleName() }}
                   </h2>
                   
                   <div class="role-separator" [class.imposter]="isImposter()"></div>
                   
                   <p class="role-label">Your Word</p>
                   <p class="secret-word" [class.imposter]="isImposter()">
                     {{ getSecretWord() }}
                   </p>
                </div>

                <!-- Bottom Decorative Strip -->
                <div class="bottom-strip"></div>
              </div>

            </div>
          </div>
        </main>

        <!-- Footer Actions -->
        <footer class="footer">
          <button class="footer-btn" (click)="confirmAndNext()" [disabled]="!hasViewedRole()">
            <span>I have memorized my role</span>
            <span class="material-symbols-outlined icon-arrow">arrow_forward</span>
          </button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    /* --- Base Layout --- */
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      background-color: var(--color-background, #111621);
      color: #fff;
      font-family: 'Manrope', sans-serif;
      overflow: hidden; /* Prevent scroll on reveal animation */
    }

    .role-reveal-page {
      position: relative;
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Abstract Background Blob */
    .bg-blob {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 150%;
      height: 80%;
      background-color: rgba(32, 96, 223, 0.1);
      filter: blur(100px);
      border-radius: 9999px;
      z-index: 0;
      pointer-events: none;
    }

    /* Mobile Container (Centered on Desktop) */
    .mobile-container {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 448px; /* max-w-md */
      height: 100vh; /* Fill screen height */
      margin: 0 auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
      transition: max-width 0.3s ease;
    }

    @media (min-width: 768px) {
      .mobile-container {
        max-width: 380px; /* Further reduced */
        height: auto;
        min-height: auto;
        margin: auto; /* Center fully */
        border-radius: 20px;
        background-color: rgba(17, 22, 33, 0.5);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        transform: scale(0.95); /* Slight overall scale down */
      }
      
      .role-reveal-page {
        overflow-y: hidden; /* Prevent scroll */
        justify-content: center;
        padding: 0;
      }

      .card-container {
        max-height: 400px; /* Reduced to fit */
      }
      
      .header {
        padding-top: 1.5rem;
        padding-bottom: 0.5rem;
      }
      
      .footer {
        padding: 1rem 1.5rem 1.5rem;
      }

      .player-turn-title {
        font-size: 1.75rem;
      }
      
      .context-section {
        margin-bottom: 1rem;
      }
    }

    /* --- Header --- */
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-top: 2rem; /* pt-8 */
      padding-bottom: 1rem; /* pb-4 */
      padding-left: 1.5rem; /* px-6 */
      padding-right: 1.5rem;
      z-index: 10;
    }

    .progress-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.5rem; /* gap-2 */
      margin-bottom: 1rem; /* mb-4 */
    }

    .progress-indicator {
      height: 0.375rem; /* h-1.5 */
      border-radius: 9999px; /* rounded-full */
      transition: all 0.3s ease;
    }

    .progress-indicator {
      width: 0.375rem; /* w-1.5 */
      background-color: #475569; /* slate-600 */
    }

    .progress-indicator.active {
      width: 2rem; /* w-8 */
      background-color: #2060df; /* primary */
    }
    
    .progress-indicator.completed {
        background-color: #94a3b8; /* slate-400 */
    }

    .progress-text {
      color: #94a3b8; /* slate-400 */
      font-size: 0.875rem; /* text-sm */
      font-weight: 500;
      letter-spacing: 0.025em; /* tracking-wide */
      text-transform: uppercase;
      margin: 0;
    }

    /* --- Main Content --- */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 1.5rem; /* px-6 */
      position: relative;
      width: 100%;
    }

    .context-section {
      width: 100%;
      text-align: center;
      margin-bottom: 1.5rem; /* mb-6 */
      transition: opacity 0.3s;
    }
    .context-section.fade-out { opacity: 0.4; }

    .player-turn-title {
      font-size: 1.875rem; /* text-3xl */
      font-weight: 700;
      letter-spacing: -0.025em; /* tracking-tight */
      color: #fff;
      margin: 0 0 0.5rem 0; /* mb-2 */
    }

    .instruction-text {
      color: #94a3b8; /* slate-400 */
      font-size: 1rem; /* text-base */
      margin: 0;
    }

    /* --- Card --- */
    .card-container {
      width: 100%;
      aspect-ratio: 4 / 5;
      max-height: 480px;
      position: relative;
      perspective: 1000px;
    }

    .card-glow {
      position: absolute;
      inset: 0;
      background-color: rgba(32, 96, 223, 0.2); /* primary/20 */
      border-radius: 1rem; /* rounded-2xl */
      filter: blur(40px); /* blur-2xl */
      opacity: 0.5; /* opacity-50 */
      transform: scale(0.95) translateY(1rem);
    }

    .interactive-card {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: #1c212e; /* dark bg override */
      border-radius: 1rem; /* rounded-2xl */
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-xl */
      overflow: hidden;
      border: 1px solid #1e293b; /* border-slate-800 */
      display: flex;
      flex-direction: column;
      transition: all 0.3s;
      cursor: pointer;
      user-select: none;
    }

    .interactive-card:active {
        transform: scale(0.98);
    }

    /* Card Header Image */
    .card-header-image {
      height: 33.333%; /* h-1/3 */
      width: 100%;
      background-color: #1e293b; /* bg-slate-800 */
      position: relative;
      overflow: hidden;
    }

    .abstract-pattern {
      position: absolute;
      inset: 0;
      background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBGSOswEwrk-emgNgPfpe_7vyPQiBC0gNXtgK2SwJCJB8MPbL370Ys9-mpQYr6exV_tBM-OV0BhUBCSUt7f532YIYIo_HWK2fobvo_zL8YTmv7pOTaV1tvmEQzSSXK-CAOvEYKv4-GsXcOzbhf3Y8bcxkc9BJrh77r59mzalK_1_GRm_ZoVvtm45zVaalV1xJHIIYTQWRPWJW5_DNhgdUUxsRevLslelJHLJ1bY_oeWdYrMoVmhs-DV8KV2okZRNI3q2tdBsIOdLQU');
      background-size: cover;
      background-position: center;
      opacity: 0.8;
      mix-blend-mode: overlay;
    }

    .gradient-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent, #1c212e);
    }

    .visibility-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background-color: rgba(0,0,0,0.3);
      backdrop-filter: blur(12px);
      border-radius: 9999px;
      padding: 0.375rem;
      color: rgba(255,255,255,0.8);
      display: flex;
    }
    .visibility-badge span { font-size: 1.25rem; }

    /* Card Body */
    .card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem; /* p-6 */
      text-align: center;
      position: relative;
      z-index: 10;
    }

    /* Hidden State Styles */
    .state-hidden {
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: opacity 0.2s;
    }
    .state-hidden.hidden {
        display: none;
    }

    .fingerprint-circle {
      margin-bottom: 1rem; /* mb-4 */
      padding: 1rem; /* p-4 */
      border-radius: 9999px;
      background-color: rgba(30, 41, 59, 0.5); /* bg-slate-800/50 */
      color: #2060df; /* primary */
      display: flex;
    }

    .fingerprint-icon { font-size: 2.25rem; /* text-4xl */ }

    .card-title {
      font-size: 1.5rem; /* text-2xl */
      font-weight: 700;
      color: #fff;
      margin: 0 0 0.5rem 0; /* mb-2 */
    }

    .card-desc {
      color: #94a3b8; /* slate-400 */
      font-size: 0.875rem; /* text-sm */
      max-width: 200px;
      line-height: 1.5;
      margin: 0;
    }

    /* Revealed State Styles */
    .state-revealed {
        display: none;
        flex-direction: column;
        align-items: center;
        width: 100%;
        animation: fadeIn 0.3s ease-out;
    }
    .state-revealed.visible {
        display: flex;
    }

    .role-preheader {
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #2060df; /* primary */
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .role-name {
        font-size: 2.25rem; /* 4xlish */
        font-weight: 900;
        color: #fff;
        margin: 0 0 1.5rem 0;
        text-transform: uppercase;
        line-height: 1;
    }
    .role-name.imposter { color: #ef4444; }

    .role-separator {
        width: 4rem; /* w-16 */
        height: 0.25rem; /* h-1 */
        background-color: #2060df;
        border-radius: 9999px;
        margin-bottom: 1.5rem;
    }
    .role-separator.imposter { background-color: #ef4444; }

    .role-label {
        color: #94a3b8;
        font-size: 1rem;
        margin-bottom: 0.25rem;
    }
    .role-team {
        font-size: 1.25rem;
        font-weight: 700;
        color: #e2e8f0;
        margin: 0;
    }
    .role-team.imposter { color: #ef4444; }

    .secret-word {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--color-primary, #2060df);
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .secret-word.imposter { color: #ef4444; }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }


    /* Decorative Bottom Strip */
    .bottom-strip {
      height: 4px;
      width: 100%;
      background: linear-gradient(to right, transparent, rgba(32, 96, 223, 1), transparent);
      opacity: 0.5;
      position: absolute;
      bottom: 0;
      left: 0;
    }

    /* --- Footer --- */
    .footer {
      width: 100%;
      padding: 2rem 1.5rem 2.5rem 1.5rem; /* px-6 py-8 pb-10 */
      background-color: transparent;
      z-index: 10;
    }

    .footer-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: 0.75rem; /* rounded-xl */
      background-color: #2060df; /* primary */
      color: white;
      height: 3.5rem; /* h-14 */
      font-weight: 700;
      font-size: 1.125rem; /* text-lg */
      border: none;
      box-shadow: 0 10px 15px -3px rgba(32, 96, 223, 0.2); /* shadow-lg shadow-primary/20 */
      transition: all 0.2s;
      cursor: pointer;
    }
    
    .footer-btn:hover:not(:disabled) {
        background-color: #2563eb; /* hover:bg-blue-600 */
    }
    
    .footer-btn:active:not(:disabled) {
        transform: scale(0.98);
    }

    .footer-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #334155;
        box-shadow: none;
        color: #94a3b8;
    }

    .icon-arrow {
      font-size: 1.25rem; /* text-xl */
      transition: transform 0.2s;
    }

    .footer-btn:hover .icon-arrow {
        transform: translateX(4px);
    }

    .footer-note {
      margin-top: 1rem; /* mt-4 */
      text-align: center;
      font-size: 0.75rem; /* text-xs */
      color: #475569; /* slate-600 in dark mode is darker, but user asked for dark:text-slate-600, let's use slate-500 for visibility */
      color: #64748b;
    }
  `]
})
export class RoleRevealPage {
  private router = inject(Router);
  private categoryService = inject(CategoryService);

  // State
  isRevealed = signal(false);
  hasViewedRole = signal(false);

  // Selectors
  currentPlayer = GameSelectors.currentPlayer;
  currentPlayerIndex = GameSelectors.currentPlayerIndex;
  totalPlayers = GameSelectors.playerCount;
  allPlayers = GameSelectors.allPlayers;

  // Computed
  isImposter = computed(() => this.currentPlayer().role?.isImposter());

  /**
   * Get the role name using category terminology
   */
  getRoleName(): string {
    const isImp = this.isImposter();
    return isImp
      ? this.categoryService.impostorName()
      : this.categoryService.crewmateName();
  }

  /**
   * Get the team name using category terminology
   */
  getTeamName(): string {
    const isImp = this.isImposter();
    return isImp
      ? this.categoryService.impostorTeamName()
      : this.categoryService.crewmateTeamName();
  }

  /**
   * Get the secret word based on player role
   * Crewmates see the real word, impostor sees a different (fake) word
   */
  getSecretWord(): string {
    const isImp = this.isImposter();
    return isImp
      ? GameSelectors.impostorWord()
      : GameSelectors.secretWord();
  }

  startReveal(): void {
    this.isRevealed.set(true);
    this.hasViewedRole.set(true);
  }

  endReveal(): void {
    this.isRevealed.set(false);
  }

  confirmAndNext(): void {
    GameActions.markCurrentPlayerViewedRole();
    const hasMore = GameActions.nextPlayer();

    this.isRevealed.set(false);
    this.hasViewedRole.set(false);

    if (!hasMore) {
      // All players have seen their roles - game is ready for real-life play
      GameActions.resetGame();
      this.router.navigate(['/']);
    }
  }
}
