import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Alarms } from '../models/alarms.model';
//import { ManageComponent } from 'src/app/pages/clients/manage/manage.component';


@Injectable({
  providedIn: 'root'
})
export class AlarmService {

  

  http = inject(HttpClient)


list(): Observable<{ data: Alarms[] }> {
  return this.http.get<{ data: Alarms[] }>(`${environment.url_ms_modulos}alarm`);
}

  view(id: number): Observable<Alarms> {
    return this.http.get<Alarms>(`${environment.url_ms_modulos}alarm/${id}`);
  }

  create(alarms: Alarms): Observable<Alarms> {
    return this.http.post<Alarms>(`${environment.url_ms_modulos}alarm`, alarms);
  }


  update(alarms:Alarms): Observable<Alarms> {
    return this.http.put<Alarms>(`${environment.url_ms_modulos}alarm/${alarms.id}`, alarms);
  }
  delete(id: number): Observable<Alarms> {
    return this.http.delete<Alarms>(`${environment.url_ms_modulos}alarm/${id}`);
  }

}
