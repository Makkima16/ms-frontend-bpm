import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module'; 
import { ManageComponent } from './manage/manage.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { ListComponent } from './list/list.component';
import { AdminCreateComponent } from './admin-create/admin-create.component';


@NgModule({
  declarations: [
    ManageComponent,
    AdminListComponent,
    AdminEditComponent, 
    ListComponent,
    AdminCreateComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ]
})
export class TheCoursesModule { }
