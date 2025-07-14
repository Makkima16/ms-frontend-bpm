import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BPMValencia';


  router = inject(Router)
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Esperamos un pequeño tiempo para asegurar que la vista se renderizó
        setTimeout(() => {
          const loader = document.getElementById('global-loader');
          if (loader) {
            loader.style.display = 'none';
          }
        }, 300); // puedes ajustar este tiempo si ves que aún se muestra contenido en blanco
      }
    });
  }
}
