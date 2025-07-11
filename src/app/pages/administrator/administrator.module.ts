import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministratorRoutingModule } from './administrator-routing.module';
import { ManageComponent } from './manage/manage.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [ManageComponent],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    NgxChartsModule
  ]
})
export class AdministratorModule { }
