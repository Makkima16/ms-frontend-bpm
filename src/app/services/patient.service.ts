import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Patients } from '../models/patients.model';



@Injectable({
  providedIn: 'root'
})
export class PatientService {

  

  http = inject(HttpClient)


  list(): Observable<{ data: Patients[] }> {
    return this.http.get<{ data: Patients[] }>(`${environment.url_ms_modulos}patients`);
  }

  view(id: number): Observable<Patients> {
    return this.http.get<Patients>(`${environment.url_ms_modulos}patients/${id}`);
  }

  create(patients: Patients): Observable<Patients> {
    return this.http.post<Patients>(`${environment.url_ms_modulos}patients`, patients);
  }


  update(patients:Patients): Observable<Patients> {
    return this.http.put<Patients>(`${environment.url_ms_modulos}patients/${patients.id}`, patients);
  }
  delete(id: number): Observable<Patients> {
    return this.http.delete<Patients>(`${environment.url_ms_modulos}patients/${id}`);
  }

  byAlarm(id: number): Observable<Patients[]> {
    return this.http.get<Patients[]>(`${environment.url_ms_modulos}patients/${id}/alarms`);
  }


}
