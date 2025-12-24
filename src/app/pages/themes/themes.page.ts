import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '@state/theme/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-themes',
  imports: [CommonModule],
  template: `
    <div class="themes-page">
      <header class="themes-header">
        <button class="back-btn" (click)="goBack()">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>Themes</h1>
      </header>

      <main class="themes-content">
        <div class="theme-grid">
          @for (theme of themeService.availableThemes; track theme.id) {
            <button 
              class="theme-option"
              [class.selected]="themeService.activeTheme().id === theme.id"
              (click)="selectTheme(theme.id)">
              <div class="theme-preview">
                <div class="preview-colors">
                  <span class="color-dot" [style.background-color]="theme.preview.primary"></span>
                  <span class="color-dot" [style.background-color]="theme.preview.secondary"></span>
                  <span class="color-dot" [style.background-color]="theme.preview.background"></span>
                  <span class="color-dot" [style.background-color]="theme.preview.text"></span>
                </div>
              </div>
              <span class="theme-name">{{ theme.name }}</span>
              <span class="theme-desc">{{ theme.description }}</span>
              @if (themeService.activeTheme().id === theme.id) {
                <span class="check-mark">
                  <span class="material-symbols-outlined text-sm">check</span>
                </span>
              }
            </button>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .themes-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--color-background);
    }

    .themes-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--color-border);
      background-color: var(--color-surface);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .themes-header h1 {
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

    .themes-content {
      flex: 1;
      padding: var(--spacing-4);
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    }

    .theme-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .theme-option {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: var(--spacing-4);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: left;
    }

    .theme-option:hover {
      border-color: var(--color-primary);
    }

    .theme-option.selected {
      border-color: var(--color-primary);
      background-color: var(--color-surface-hover);
      box-shadow: 0 0 0 1px var(--color-primary);
    }

    .theme-preview {
      margin-bottom: var(--spacing-2);
    }

    .preview-colors {
      display: flex;
      gap: var(--spacing-1);
    }

    .color-dot {
      width: 24px;
      height: 24px;
      border-radius: var(--border-radius-full);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .theme-name {
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin-bottom: var(--spacing-1);
      font-size: 1rem;
    }

    .theme-desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .check-mark {
      position: absolute;
      top: var(--spacing-4);
      right: var(--spacing-4);
      width: 24px;
      height: 24px;
      background-color: var(--color-primary);
      color: white;
      border-radius: var(--border-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .text-sm {
        font-size: 18px;
    }
  `]
})
export class ThemesPage {
  private router = inject(Router);
  themeService = inject(ThemeService);

  goBack(): void {
    this.router.navigate(['/']);
  }

  selectTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
  }
}
