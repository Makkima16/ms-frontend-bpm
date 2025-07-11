/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Aprobados } from '../models/aprobados.model';



@Injectable({
  providedIn: 'root'
})
export class AprobadosService {

  

  http = inject(HttpClient)


  enviarCorreo(correo: any): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_correos}/send-email`, correo);
  }

  correos_automaticos(name: string, email: string, cedula: string): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_correos}send-email`, { name, email, cedula });
  }


  list(): Observable<Aprobados[]> {
    return this.http.get<Aprobados[]>(`${environment.url_ms_modulos}aprobatorio`);
  }

  view(id: number): Observable<Aprobados> {
    return this.http.get<Aprobados>(`${environment.url_ms_modulos}aprobatorio/${id}`);
  }

  create(titular: Aprobados): Observable<Aprobados> {
    return this.http.post<Aprobados>(`${environment.url_ms_modulos}aprobatorio`, titular);
  }


  update(titular: Aprobados): Observable<Aprobados> {
    return this.http.put<Aprobados>(`${environment.url_ms_modulos}aprobatorio/${titular.id}`, titular);
  }
  

  delete(id: number): Observable<Aprobados> {
    return this.http.delete<Aprobados>(`${environment.url_ms_modulos}aprobatorio/${id}`);
  }

  getAprobadoByClientId(clientId: number): Observable<Aprobados> {
    return this.http.get<Aprobados>(`${environment.url_ms_modulos}aprobatorio/client/${clientId}`);
  }

}
