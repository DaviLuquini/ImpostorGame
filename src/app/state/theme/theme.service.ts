import { Injectable, signal, effect, inject } from '@angular/core';
import { Theme } from '@themes/theme.interface';
import { THEME_REGISTRY, DEFAULT_THEME_ID, getThemeById } from '@themes/theme-registry';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

const THEME_STORAGE_KEY = 'imposter-game-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private storage = inject(LocalStorageService);

    activeTheme = signal<Theme>(this.getInitialTheme());
    availableThemes = THEME_REGISTRY;

    constructor() {
        effect(() => {
            const theme = this.activeTheme();
            this.applyTheme(theme);
        });
    }

    private getInitialTheme(): Theme {
        const savedThemeId = this.storage.get<string>(THEME_STORAGE_KEY);
        return getThemeById(savedThemeId ?? DEFAULT_THEME_ID);
    }

    setTheme(themeId: string): void {
        const theme = getThemeById(themeId);
        this.activeTheme.set(theme);
        this.storage.set(THEME_STORAGE_KEY, themeId);
    }

    private applyTheme(theme: Theme): void {
        THEME_REGISTRY.forEach(t => {
            document.body.classList.remove(t.cssClass);
        });
        document.body.classList.add(theme.cssClass);
    }
}
