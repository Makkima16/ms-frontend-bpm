import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Records } from '../models/records.model';
import { Client } from '../models/client.model';
import { Course } from '../models/course.model';
import { ModulesClients } from '../models/modules-clients.model';

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
    getClientById(id: number): Observable<Client> {
      return this.http.get<Client>(`${environment.url_ms_modulos}clients/${id}`);
    }
    getExamById(id: number): Observable<ModulesClients> {
      return this.http.get<ModulesClients>(`${environment.url_ms_modulos}examen/${id}`);
    }
    
  

}
