import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministratorRoutingModule } from './administrator-routing.module';
import { ManageComponent } from './manage/manage.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './create/create.component';


@NgModule({
  declarations: [ManageComponent, CreateComponent],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    NgxChartsModule,
    FormsModule,
    NgbModule,
  ]
})
export class AdministratorModule { }
