import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from '../../pages/home/home.component';
import { VisitorLayoutRoutes } from './visitor-layout.routing';
import { CompanyComponent } from '../../pages/company/company.component';
import { AboutComponent } from '../../pages/about/about.component';

// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VisitorLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
  ],
  declarations: [
    HomeComponent,
    CompanyComponent,
    AboutComponent

  ]
})

export class VisitorLayoutModule { }