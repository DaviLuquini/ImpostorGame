import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameSelectors } from '@state/game/game.selectors';

export const gameSessionGuard: CanActivateFn = () => {
    const router = inject(Router);
    const isGameActive = GameSelectors.isGameActive();

    if (!isGameActive) {
        router.navigate(['/']);
        return false;
    }

    return true;
};
