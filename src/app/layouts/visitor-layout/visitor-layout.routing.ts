import { Routes } from '@angular/router';
import { HomeComponent } from '../../pages/home/home.component';
import { CompanyComponent } from '../../pages/company/company.component';
import { AboutComponent } from '../../pages/about/about.component';


export const VisitorLayoutRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'empresa', component: CompanyComponent },
    { path: 'nosotros', component: AboutComponent },


];
