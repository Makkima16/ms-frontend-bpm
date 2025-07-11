import { Routes } from '@angular/router';

import { AuthGuard } from '../../guards/auth.guard';
import { ListRComponent } from '../../pages/list-r/list-r.component';
import { HomeComponent } from '../../pages/home/home.component';

//Rutas para ir hacia las diferentes partes de la Pagina
export const AdminLayoutRoutes: Routes = [
    { path: 'home', component: HomeComponent },

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

    {
        path: "alarmas",canActivate:[AuthGuard],
        loadChildren:() => import('../../pages/alarms/alarms.module').then(m=>m.AlarmsModule)
    },

    {
        path: "pacientes",canActivate:[AuthGuard],
        loadChildren:() => import('../../pages/patients/patients.module').then(m=>m.PatientsModule)
    },

        {
        path: "admin",canActivate:[AuthGuard],
        loadChildren:() => import('../../pages/administrator/administrator.module').then(m=>m.AdministratorModule)
    },
    
    
    { path: 'admin-listRegistros',canActivate:[AuthGuard],          component: ListRComponent },





    



    



];
