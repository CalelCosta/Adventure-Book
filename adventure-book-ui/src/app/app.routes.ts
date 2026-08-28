import { Routes } from '@angular/router';
import { gameGuard } from './core/guards/game.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'library', pathMatch: 'full' },
  {
    path: 'library',
    loadComponent: () =>
      import('./features/library/library.component').then((m) => m.LibraryComponent),
  },
  {
    path: 'game',
    canActivate: [gameGuard],
    loadComponent: () =>
      import('./features/game/game-view.component').then((m) => m.GameViewComponent),
  },
];
