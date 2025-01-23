import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { AuthGuard } from '../../guards/auth.guard';
import { ListRComponent } from '../../pages/list-r/list-r.component';

//Rutas para ir hacia las diferentes partes de la Pagina
export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },

    {
        path: "courses",canActivate:[AuthGuard],
        loadChildren:() => import('../../pages/courses/courses.module').then(m=>m.TheCoursesModule)
    },
    {
        path : 'examen', canActivate:[AuthGuard],
        loadChildren:() => import('../../pages/examen/examen.module').then(m=>m.ExamenModule)
    },

    {
        path : 'clients', canActivate:[AuthGuard],
        loadChildren:() => import('../../pages/clients/clients.module').then(m=>m.ClientsModule)
    },

    {
        path : 'payments', canActivate:[AuthGuard],
        loadChildren:() => import('../../pages/payment/payment.module').then(m=>m.PaymentModule)
    },

    {
        path: "aprobados",canActivate:[AuthGuard],
        loadChildren:() => import('../../pages/aprobados/aprobados.module').then(m=>m.AprobadosModule)
    },
    
    
    { path: 'admin-listRegistros',canActivate:[AuthGuard],          component: ListRComponent },





    



    



];
