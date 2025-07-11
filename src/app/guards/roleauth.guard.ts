import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleauthGuard implements CanActivate {

  private router = inject(Router);
  private rolename: string;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const decodedToken = this.decodeToken(token);
    this.rolename = decodedToken && decodedToken.role && decodedToken.role.name;

    if (this.rolename === 'administrador') {
      return true;
    }

    if (this.rolename === 'cliente') {
      if (state.url.includes('/admin')) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: 'No tienes permisos para acceder a esta página',
          allowOutsideClick: false
        });
        return false;
      }
      return true;
    }

    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }
}
