import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { VisitorLayoutComponent } from './layouts/visitor-layout/visitor-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '', // Redirige la ruta raíz a 'home'
        pathMatch: 'full',
    },
        {
        path: '',
        component: VisitorLayoutComponent,
        children: [
            {
                path: '',  // Asegúrate de que este es el path correcto
                loadChildren: () => import('./layouts/visitor-layout/visitor-layout.module').then(m => m.VisitorLayoutModule)
            }
        ]
    },
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',  // Asegúrate de que este es el path correcto
                loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
            }
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''  // Redirige cualquier ruta desconocida a 'home'
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, {
            useHash: true // Esto es opcional
        })
    ],
    exports: [
        RouterModule
    ],
})
export class AppRoutes { }
