import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { ModulesClients } from '../models/modules-clients.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http: HttpClient) {}

  create(examen: ModulesClients): Observable<ModulesClients> {
    return this.http.post<ModulesClients>(`${environment.url_ms_modulos}examen`, examen);
  }

  getQuestionsByModule(module_id: number): Observable<any> {
    return this.http.get(`${environment.url_ms_modulos}modulos/${module_id}/questions`);
  }

      // Crear Registro Examen
  update(examen: ModulesClients): Observable<ModulesClients> {
    return this.http.put<ModulesClients>(`${environment.url_ms_modulos}examen/${examen.id}`, examen);
  }
  view(id: number): Observable<ModulesClients> {
    return this.http.get<ModulesClients>(`${environment.url_ms_modulos}examen/${id}`);
  }

  list(): Observable<ModulesClients[]> {
    return this.http.get<ModulesClients[]>(`${environment.url_ms_modulos}examen`);
  }
  delete(id: number): Observable<ModulesClients> {
    return this.http.delete<ModulesClients>(`${environment.url_ms_modulos}examen/${id}`);
  }


  checkModuleApproval(clientId: number, module_id: number): Observable<{ has_passed: boolean }> {
    return this.http.post<{ has_passed: boolean }>(`${environment.url_ms_modulos}exam/check-approval`, {
      client_id: clientId,
      module_id: module_id
    });
  }
  
}
