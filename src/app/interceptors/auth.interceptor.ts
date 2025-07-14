import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
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

    // Si la solicitud es para login o validación de token, no añadir header
    if (request.url.includes('/login') || request.url.includes('/token-validation')) {
      return next.handle(request);
    }

    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(authRequest).pipe(
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
        return new Observable<never>();
      })
    );
  }
}
