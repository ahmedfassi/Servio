import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const loginRedirect = () =>
    router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });

  if (!auth.isLoggedIn()) {
    return loginRedirect();
  }

  return auth.getMe().pipe(
    map((user) => {
      if (user.role === 'admin') return true;
      auth.logout();
      return router.createUrlTree(['/login'], { queryParams: { reason: 'admin' } });
    }),
    catchError((error: HttpErrorResponse) => {
      auth.logout();
      return of(loginRedirect());
    }),
  );
};
