import { Routes } from '@angular/router';
import { gameSessionGuard } from '@core/guards/game-session.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@pages/home/home.page').then(m => m.HomePage)
    },
    {
        path: 'role-reveal',
        canActivate: [gameSessionGuard],
        loadComponent: () => import('@pages/role-reveal/role-reveal.page').then(m => m.RoleRevealPage)
    },
    {
        path: 'settings',
        loadComponent: () => import('@pages/settings/settings.page').then(m => m.SettingsPage)
    },
    {
        path: 'categories',
        loadComponent: () => import('@pages/categories/categories.page').then(m => m.CategoriesPage)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
