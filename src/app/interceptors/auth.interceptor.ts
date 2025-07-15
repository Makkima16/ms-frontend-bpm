import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retryWhen, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SecurityService } from '../services/security.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private securityService = inject(SecurityService);
  private router = inject(Router);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const theUser = this.securityService.activeUserSession;
    const token = theUser["token"];

    if (request.url.includes('/login') || request.url.includes('/token-validation')) {
      return next.handle(request);
    }

    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(authRequest).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, retryCount) => {
            if (retryCount < 2 && error.status === 500) {
              // Esperar 2 segundos y reintentar hasta 2 veces
              return timer(2000);
            }
            return throwError(() => error);
          })
        )
      ),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          Swal.fire({
            title: 'No está autorizado para esta operación',
            icon: 'error',
            timer: 5000
          });
          this.router.navigateByUrl('/');
        } else if (err.status >= 400) {
          Swal.fire({
            title: 'Existe un error, contacte al administrador',
            icon: 'error',
            timer: 5000
          });
        }
        return throwError(() => err);
      })
    );
  }
}
