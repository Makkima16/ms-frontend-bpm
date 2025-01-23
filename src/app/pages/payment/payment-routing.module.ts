import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { AuthGuard } from '../../guards/auth.guard';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: 'validation',                  
    component: ManageComponent },

    { path: 'admin-listPay', 
      canActivate:[AuthGuard],           
      component: ListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
