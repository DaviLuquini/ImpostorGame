import { Injectable, signal, effect, inject, computed } from '@angular/core';
import { Category } from '../../categories/category.interface';
import {
    getAllCategories,
    getCategoryById,
    getRandomWordFromCategory,
    DEFAULT_CATEGORY_ID,
    getAllWords
} from '../../categories/category-registry';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

const CATEGORY_STORAGE_KEY = 'imposter-game-category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private storage = inject(LocalStorageService);

    activeCategory = signal<Category>(this.getInitialCategory());
    availableCategories = getAllCategories();

    // Computed helpers for terminology
    impostorName = computed(() => this.activeCategory().terminology.impostor);
    crewmateName = computed(() => this.activeCategory().terminology.crewmate);
    impostorTeamName = computed(() => this.activeCategory().terminology.impostorTeam);
    crewmateTeamName = computed(() => this.activeCategory().terminology.crewmateTeam);

    constructor() {
        effect(() => {
            const category = this.activeCategory();
            this.applyCategory(category);
        });
    }

    private getInitialCategory(): Category {
        const savedCategoryId = this.storage.get<string>(CATEGORY_STORAGE_KEY);
        return getCategoryById(savedCategoryId ?? DEFAULT_CATEGORY_ID);
    }

    setCategory(categoryId: string): void {
        const category = getCategoryById(categoryId);
        this.activeCategory.set(category);
        this.storage.set(CATEGORY_STORAGE_KEY, categoryId);
    }

    /**
     * Get a random secret word based on active category
     */
    getSecretWord(): string {
        return getRandomWordFromCategory(this.activeCategory().id);
    }

    /**
     * Get two distinct words from the active category
     * Returns { crewmateWord, impostorWord }
     */
    getTwoDistinctWords(): { crewmateWord: string; impostorWord: string } {
        const category = this.activeCategory();
        let words: string[];

        if (category.id === 'default') {
            words = getAllWords();
        } else {
            words = category.words;
        }

        // Shuffle and pick 2 different words
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        return {
            crewmateWord: shuffled[0] ?? 'Unknown',
            impostorWord: shuffled[1] ?? shuffled[0] ?? 'Unknown'
        };
    }

    private applyCategory(category: Category): void {
        // Remove all category theme classes and apply the new one
        const allCategories = getAllCategories();
        allCategories.forEach(c => {
            document.body.classList.remove(c.cssClass);
        });
        document.body.classList.add(category.cssClass);
    }
}
