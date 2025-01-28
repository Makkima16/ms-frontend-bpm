import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  isAdminMenuOpen: boolean = false;
  isCreateMenuOpen: boolean = false;
  isListMenuOpen: boolean = false;
  userName: string | null = null;
  userRole: string | null = null;
  isAdminMode: boolean = false;

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;

    if (token) {
      const decodedToken = this.decodeToken(token);
      this.userName = this.decodeUtf8(decodedToken.name); // Transformar el nombre
      this.userRole = decodedToken && decodedToken.role && decodedToken.role.name; // Obtener el nombre del rol del usuario
      this.isAdminMode = this.userRole === 'Administrador'; // Activa el modo admin si el rol es "Administrador"
    }
  }


  decodeUtf8(value: string): string {
    try {
      return decodeURIComponent(escape(value));
    } catch {
      return value; // Retorna el valor original si ocurre un error
    }
  }
  
  decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleAdminMenu() {
    this.isAdminMenuOpen = !this.isAdminMenuOpen;
  }

  toggleCreateMenu() {
    this.isCreateMenuOpen = !this.isCreateMenuOpen;
  }

  toggleListMenu() {
    this.isListMenuOpen = !this.isListMenuOpen;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    sessionStorage.clear();
    this.userName = null;
    this.userRole = null;
    this.isAdminMode = false;
    this.router.navigate(['dashboard']);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }



}
