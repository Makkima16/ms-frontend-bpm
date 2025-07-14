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
    return this.http.get<Company[]>(`${environment.url_ms_modulos}company`);
  }

  view(id: number): Observable<Company> {
    return this.http.get<Company>(`${environment.url_ms_modulos}company/${id}`);
  }
  create(CompanyData: Company): Observable<any> {
    return this.http.post(`${environment.url_ms_modulos}company`, CompanyData);
  }
  
  update(Company:Company): Observable<Company> {
    return this.http.put<Company>(`${environment.url_ms_modulos}company/${Company.id}`, Company);
  }
  delete(id: number): Observable<Company> {
    return this.http.delete<Company>(`${environment.url_ms_modulos}company/${id}`);
  }

  
}

