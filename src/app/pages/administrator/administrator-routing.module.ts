import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { CreateComponent } from './create/create.component';

const routes: Routes = [
    {
      path:'info',
      component:ManageComponent
    },
    {
      path:'admin-create',
      component:CreateComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
