import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
    {
    path:'admin-list',
    component:ListComponent,
    canActivate:[AuthGuard]

  },
  {
    path:'admin-correo',
    component:ManageComponent,
    canActivate:[AuthGuard]

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobadosRoutingModule { }
