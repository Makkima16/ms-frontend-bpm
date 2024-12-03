import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SecurityService } from '../services/security.service';

@Injectable({
  providedIn: 'root'
})
export class RoleauthGuard implements CanActivate {

  constructor(private router: Router, private securityService: SecurityService) {}

  rolename: string;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
  
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;
    if (!token) {
      this.router.navigate(['/login']);
      
      return false;
    }
  
    const decodedToken = this.decodeToken(token);
    this.rolename = decodedToken && decodedToken.role && decodedToken.role.name; // Obtener el nombre del rol del usuario
  
    if (this.rolename == 'administrador') {
      console.log('Guard is activated for route: ', state.url);  // Agrega esto para verificar si se activa el guardia

      return true;
    }
  
    if (this.rolename == 'cliente') {
      console.log('Guard is activated for route: ', state.url);  // Agrega esto para verificar si se activa el guardia

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
  

  // Método para decodificar el token JWT
  decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const payload = parts[1];  // El payload está en la segunda parte
    const decoded = atob(payload);  // Decodificamos en base64
    return JSON.parse(decoded);  // Retornamos el payload como objeto
  }
}
