import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { AuthGuard } from '../../guards/auth.guard';
import { ListComponent } from './list/list.component';

const routes: Routes = [
    {
      path:'admin-create',
      component:ManageComponent,
      canActivate:[AuthGuard]
  
    },
        {
      path:'admin-list',
      component:ListComponent,
      canActivate:[AuthGuard]
  
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlarmsRoutingModule { }
