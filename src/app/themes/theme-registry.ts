import { Theme } from './theme.interface';
import { ClassicTheme } from './classic/classic.theme';
import { DarkMysteryTheme } from './dark-mystery/dark-mystery.theme';
import { NeonSpyTheme } from './neon-spy/neon-spy.theme';
import { VintageDetectiveTheme } from './vintage-detective/vintage-detective.theme';
import { MinimalModernTheme } from './minimal-modern/minimal-modern.theme';

export const THEME_REGISTRY: Theme[] = [
    ClassicTheme,
    DarkMysteryTheme,
    NeonSpyTheme,
    VintageDetectiveTheme,
    MinimalModernTheme
];

export const DEFAULT_THEME_ID = 'classic';

export function getThemeById(id: string): Theme {
    return THEME_REGISTRY.find(t => t.id === id) ?? ClassicTheme;
}
