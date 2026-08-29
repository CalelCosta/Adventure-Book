import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../services/game.service';

export const gameGuard: CanActivateFn = () => {
  const gameService = inject(GameService);
  const router = inject(Router);

  if (gameService.currentBook()) {
    return true;
  }

  const isRestored = gameService.loadSessionFromLocalStorage();
  if (isRestored && gameService.currentBook()) {
    return true;
  }

  router.navigate(['/library']);
  return false;
};
