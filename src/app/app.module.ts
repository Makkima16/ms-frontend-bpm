import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutes } from './app.routes';
import { ComponentsModule } from './components/components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './pages/register/register.component';
import { PayService } from './services/pay.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { WebSocketService } from './services/web-socket.service';
import { ListRComponent } from './pages/list-r/list-r.component';
import { httpInterceptor } from './core/http.interceptor';
import { VisitorLayoutComponent } from './layouts/visitor-layout/visitor-layout.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutes,
    ReactiveFormsModule,

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    VisitorLayoutComponent,
    RegisterComponent,
    ListRComponent,
      ],
    providers: [PayService,
      AuthGuard,
      
      WebSocketService,{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,

        multi: true
      },
      provideHttpClient(
        withInterceptors([httpInterceptor])
      )
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
