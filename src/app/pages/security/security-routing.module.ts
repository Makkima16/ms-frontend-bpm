import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [

  {
    path:'login',
    component:ManageComponent
  },
  
  {
    path:'auth',
    component:ManageComponent
  },
  {
    path:'view/:id',
    component:ManageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
