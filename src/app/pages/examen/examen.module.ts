import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamenRoutingModule } from './examen-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageComponent } from './manage/manage.component';
import { ListComponent } from './list/list.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AdminCreateComponent } from './admin-create/admin-create.component';


@NgModule({
  declarations: [ManageComponent, ListComponent, AdminEditComponent, AdminCreateComponent],
  imports: [
    CommonModule,
    ExamenRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class ExamenModule { }
