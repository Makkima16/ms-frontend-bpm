import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { ListComponent } from './list/list.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AuthGuard } from '../../guards/auth.guard';
import { AdminCreateComponent } from './admin-create/admin-create.component';

const routes: Routes = [

  {
    path:'list',
    component:ListComponent
  },
  {
    path : 'view/:id',
    component : ManageComponent,
  },
  {
    path : 'admin-list',
    component : AdminListComponent,
    canActivate:[AuthGuard]

  },
  {
    path : 'update-exam/:id',
    component: AdminEditComponent,
    canActivate:[AuthGuard]

  },

  { 
    path: 'admin-crearCursos',
    canActivate:[AuthGuard],
    component: AdminCreateComponent },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
