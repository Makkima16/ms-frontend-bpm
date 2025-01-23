import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListComponent } from './list/list.component';
import { AprobadosRoutingModule } from './aprobados-routing.module';
import { ManageComponent } from './manage/manage.component';


@NgModule({
  declarations: [
    ListComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    AprobadosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ]
})
export class AprobadosModule { }
