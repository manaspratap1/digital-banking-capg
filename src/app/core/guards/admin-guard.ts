import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn =
    authService.isLoggedIn();

  const role =
    authService.getRole();

  if (
    isLoggedIn &&
    role === 'admin'
  ) {
    return true;
  }

  router.navigate(['/login']);

  return false;
};