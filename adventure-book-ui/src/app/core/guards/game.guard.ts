import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { GameService } from '../services/game.service';

export const gameGuard: CanActivateFn = () => {
  const gameService = inject(GameService);
  const router = inject(Router);

  if (gameService.activeSession() || gameService.loadSessionFromLocalStorage()) {
    return true;
  }

  return router.createUrlTree(['/library']);
};
