import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-visitor',
  templateUrl: './header-visitor.component.html',
  styleUrl: './header-visitor.component.css'
})
export class HeaderVisitorComponent implements OnInit {
  @ViewChild('userMenu') userMenuRef: ElementRef;
  @ViewChild('menuTrigger') menuTriggerRef: ElementRef;
  isMenuOpen: boolean ;
  isUserMenuOpen: boolean ;
  isAdminMenuOpen: boolean ;
  isCreateMenuOpen: boolean ;
  isListMenuOpen: boolean ;
  userName: string | null = null;
  userRole: string | null = null;
  userEmail: string | null = null;

  isAdminMode: boolean;



  router = inject(Router);


  ngOnInit(): void {
    const session = sessionStorage.getItem('sesion');
    const token = session ? JSON.parse(session).token : null;

    if (token) {
      const decodedToken = this.decodeToken(token);
      this.userName = this.decodeUtf8(decodedToken.name);
      this.userEmail = this.decodeUtf8(decodedToken.email); // usamos el email
      this.userRole = decodedToken?.role?.name;
      this.isAdminMode = this.userRole === 'Administrador';
    }
  }


  decodeUtf8(value: string): string {
    try {
      return decodeURIComponent(escape(value));
    } catch {
      return value;
    }
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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (
      this.isUserMenuOpen &&
      this.userMenuRef &&
      !this.userMenuRef.nativeElement.contains(event.target) &&
      !this.menuTriggerRef.nativeElement.contains(event.target)
    ) {
      this.isUserMenuOpen = false;
    }
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
    this.isUserMenuOpen = false;
  }


  logout() {
    sessionStorage.clear();
    this.userName = null;
    this.userRole = null;
    this.userEmail = null;
    this.isAdminMode = false;
    this.isUserMenuOpen = false;
    this.router.navigate(['']);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }



}
