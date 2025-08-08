import { Routes } from '@angular/router';
import { gameConfigs } from '@configs/games.config';
import { GameComponent } from './game.component';
import { gameGuard } from './game.guard';

export const gameRoutes: Routes = [
    {
        path: '',
        component: GameComponent,
        canActivateChild: [gameGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: gameConfigs.nemesisOriginal.path,
            },
            {
                path: gameConfigs.nemesisOriginal.path,
                loadComponent: () => import('./nemesis-original/nemesis-original.component').then((component) => component.NemesisOriginalComponent),
            },
        ],
    },
];
