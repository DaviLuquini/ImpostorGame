import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '@state/category/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [CommonModule],
  template: `
    <div class="categories-page">
      <header class="categories-header">
        <button class="back-btn" (click)="goBack()">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>Categories</h1>
      </header>

      <main class="categories-content">
        <p class="categories-intro">
          Choose a category to change the game's theme and secret words.
        </p>
        
        <div class="category-grid">
          @for (category of categoryService.availableCategories; track category.id) {
            <button 
              class="category-option"
              [class.selected]="categoryService.activeCategory().id === category.id"
              (click)="selectCategory(category.id)">
              
              <div class="category-preview">
                <div class="preview-colors">
                  <span class="color-dot" [style.background-color]="category.preview.primary"></span>
                  <span class="color-dot" [style.background-color]="category.preview.secondary"></span>
                  <span class="color-dot" [style.background-color]="category.preview.background"></span>
                </div>
              </div>
              
              <div class="category-info">
                <span class="category-name">{{ category.name }}</span>
                <span class="category-desc">{{ category.description }}</span>
              </div>
              
              @if (categoryService.activeCategory().id === category.id) {
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
    .categories-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--color-background);
    }

    .categories-header {
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

    .categories-header h1 {
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

    .categories-content {
      flex: 1;
      padding: var(--spacing-4);
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    }

    .categories-intro {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      margin: 0 0 var(--spacing-4);
      text-align: center;
    }

    .category-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .category-option {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--spacing-4);
      padding: var(--spacing-4);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: left;
    }

    .category-option:hover {
      border-color: var(--color-primary);
    }

    .category-option.selected {
      border-color: var(--color-primary);
      background-color: var(--color-surface-hover);
      box-shadow: 0 0 0 1px var(--color-primary);
    }

    .category-preview {
      flex-shrink: 0;
    }

    .preview-colors {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .color-dot {
      width: 20px;
      height: 20px;
      border-radius: var(--border-radius-full);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .category-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .category-name {
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      font-size: 1rem;
    }

    .category-desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .terminology-preview {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
    }

    .term {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-primary);
      background-color: rgba(32, 96, 223, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .term-separator {
      font-size: 0.625rem;
      color: var(--color-text-secondary);
      text-transform: uppercase;
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
export class CategoriesPage {
  private router = inject(Router);
  categoryService = inject(CategoryService);

  goBack(): void {
    this.router.navigate(['/']);
  }

  selectCategory(categoryId: string): void {
    this.categoryService.setCategory(categoryId);
  }
}
