import { Routes } from '@angular/router';
import { gameSessionGuard } from '@core/guards/game-session.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@pages/home/home.page').then(m => m.HomePage)
    },
    {
        path: 'lobby',
        canActivate: [gameSessionGuard],
        loadComponent: () => import('@pages/lobby/lobby.page').then(m => m.LobbyPage)
    },
    {
        path: 'role-reveal',
        canActivate: [gameSessionGuard],
        loadComponent: () => import('@pages/role-reveal/role-reveal.page').then(m => m.RoleRevealPage)
    },
    {
        path: 'discussion',
        canActivate: [gameSessionGuard],
        loadComponent: () => import('@pages/discussion/discussion.page').then(m => m.DiscussionPage)
    },
    {
        path: 'voting',
        canActivate: [gameSessionGuard],
        loadComponent: () => import('@pages/voting/voting.page').then(m => m.VotingPage)
    },
    {
        path: 'results',
        canActivate: [gameSessionGuard],
        loadComponent: () => import('@pages/results/results.page').then(m => m.ResultsPage)
    },
    {
        path: 'settings',
        loadComponent: () => import('@pages/settings/settings.page').then(m => m.SettingsPage)
    },
    {
        path: 'themes',
        loadComponent: () => import('@pages/themes/themes.page').then(m => m.ThemesPage)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
