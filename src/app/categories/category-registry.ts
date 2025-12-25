import { Category, CategoryTerminology } from './category.interface';
import { ClashRoyaleCategory } from './clash-royale/clash-royale.category';
import { LeagueOfLegendsCategory } from './league-of-legends/league-of-legends.category';
import { DevelopersCategory } from './developers/developers.category';

/**
 * All available categories (excluding Default which is special)
 */
export const CATEGORY_REGISTRY: Category[] = [
    ClashRoyaleCategory,
    LeagueOfLegendsCategory,
    DevelopersCategory
];

/**
 * Default category uses random words from all categories
 */
export const DefaultCategory: Category = {
    id: 'default',
    name: 'Default',
    description: 'Random words from all categories',
    cssClass: 'theme-classic',
    preview: {
        primary: '#2060df',
        secondary: '#8b5cf6',
        background: '#111621',
        text: '#ffffff'
    },
    terminology: {
        impostor: 'Impostor',
        crewmate: 'Crewmate',
        impostorTeam: 'Impostors',
        crewmateTeam: 'Crew'
    },
    words: [] // Will be filled dynamically from all categories
};

/**
 * Get all words from all categories combined
 */
export function getAllWords(): string[] {
    return CATEGORY_REGISTRY.flatMap(cat => cat.words);
}

/**
 * Get a random word from all categories
 */
export function getRandomWord(): string {
    const allWords = getAllWords();
    return allWords[Math.floor(Math.random() * allWords.length)];
}

/**
 * Get a random word from a specific category
 */
export function getRandomWordFromCategory(categoryId: string): string {
    if (categoryId === 'default') {
        return getRandomWord();
    }
    const category = getCategoryById(categoryId);
    return category.words[Math.floor(Math.random() * category.words.length)];
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category {
    if (id === 'default') {
        return DefaultCategory;
    }
    return CATEGORY_REGISTRY.find(c => c.id === id) ?? DefaultCategory;
}

/**
 * All categories including Default
 */
export function getAllCategories(): Category[] {
    return [DefaultCategory, ...CATEGORY_REGISTRY];
}

export const DEFAULT_CATEGORY_ID = 'default';
