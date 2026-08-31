import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { GameService } from '../services/game.service';

export const gameGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const gameService = inject(GameService);
  const router = inject(Router);

  if (route.paramMap.has('id')) {
    return true;
  }

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
