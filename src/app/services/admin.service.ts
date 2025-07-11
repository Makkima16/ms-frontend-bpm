import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin } from '../models/admin.model';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  http = inject(HttpClient)

  list(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${environment.url_ms_modulos}admin`);
  }

  view(id: number): Observable<Admin> {
    return this.http.get<Admin>(`${environment.url_ms_modulos}admin/${id}`);
  }

  create(titular: Admin): Observable<Admin> {
    return this.http.post<Admin>(`${environment.url_ms_modulos}admin`, titular);
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSummary(): Observable<any> {
    return this.http.get(`${environment.url_ms_modulos}dashboard/summary`);
  }
}