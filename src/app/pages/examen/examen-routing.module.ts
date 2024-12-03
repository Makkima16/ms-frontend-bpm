import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { ListComponent } from './list/list.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [

  {

    path : 'view/:id',
    component : ManageComponent ,


  },
  {
    path : 'admin-list',
    component: ListComponent,
    canActivate:[AuthGuard]

  },
  {
    path : 'update-exam/:id',
    component: AdminEditComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamenRoutingModule { }
