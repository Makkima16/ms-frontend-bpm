import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { AuthGuard } from '../../guards/auth.guard';
import { ListComponent } from './list/list.component';

const routes: Routes = [
      {
        path:'view',
        component:ViewComponent,
        canActivate:[AuthGuard]
    
      },
          {
        path:'list',
        component:ListComponent,
        canActivate:[AuthGuard]
  
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
