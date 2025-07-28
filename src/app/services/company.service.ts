/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environments';
import { Company } from '../models/company.model';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  http = inject(HttpClient)

  list(): Observable<Company[]> {
    return this.http.get<Company[]>(`${environment.url_ms_modulos}companies`);
  }

  view(id: number): Observable<Company> {
    return this.http.get<Company>(`${environment.url_ms_modulos}companies/${id}`);
  }
  create(CompanyData: Company): Observable<any> {
    return this.http.post(`${environment.url_ms_modulos}companies`, CompanyData);
  }
  
  update(Company:Company): Observable<Company> {
    return this.http.put<Company>(`${environment.url_ms_modulos}companies/${Company.id}`, Company);
  }
  delete(id: number): Observable<Company> {
    return this.http.delete<Company>(`${environment.url_ms_modulos}companies/${id}`);
  }

  
}

