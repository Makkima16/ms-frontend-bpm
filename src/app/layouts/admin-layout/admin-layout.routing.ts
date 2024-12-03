import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { PaymentsComponent } from '../../pages/payments/payments.component';
import { AuthGuard } from '../../guards/auth.guard';
import { ListCComponent } from '../../pages/list-c/list-c.component';
import { ListRComponent } from '../../pages/list-r/list-r.component';
import { CreateEComponent } from '../../pages/create-e/create-e.component';
import { CreateCComponent } from '../../pages/create-c/create-c.component';

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
    
    { path: 'validation',                  component: PaymentsComponent },
    { path: 'admin-listClients',canActivate:[AuthGuard],            component: ListCComponent },
    { path: 'admin-listRegistros',canActivate:[AuthGuard],          component: ListRComponent },
    { path: 'admin-createExamen',canActivate:[AuthGuard],           component: CreateEComponent },
    { path: 'admin-crearCursos', canActivate:[AuthGuard],           component: CreateCComponent },




    



    



];
