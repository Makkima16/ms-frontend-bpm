import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { HeaderVisitorComponent } from './header-visitor/header-visitor.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    HeaderVisitorComponent

  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    HeaderVisitorComponent

  ]
})
export class ComponentsModule { }
