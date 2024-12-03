import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Records } from '../models/records.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

    // Crear Registro Examen
    create(records: Records): Observable<Records> {
      return this.http.post<Records>(`${environment.url_ms_modulos}records`, records);
    }

    list(): Observable<Records[]> {
      return this.http.get<Records[]>(`${environment.url_ms_modulos}records`);
    }
  

}
