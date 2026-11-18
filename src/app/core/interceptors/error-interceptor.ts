import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (isPlatformBrowser(platformId)) {
        const message =
          err.status === 0
            ? 'Network error, please check your connection'
            : err.error?.message || err.message || 'Something went wrong';

        toastr.error(message, 'E-Commerce App');
      }

      return throwError(() => err);
    })
  );
};
