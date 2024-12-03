import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Client } from '../models/client.model';
//import { ManageComponent } from 'src/app/pages/clients/manage/manage.component';


@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  

  constructor(
    private http: HttpClient
  ) { 
  }

  list(): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.url_ms_modulos}clients`);
  }

  view(id: number): Observable<Client> {
    return this.http.get<Client>(`${environment.url_ms_modulos}clients/${id}`);
  }

  create(titular: Client): Observable<Client> {
    return this.http.post<Client>(`${environment.url_ms_modulos}clients`, titular);
  }


  update(titular:Client): Observable<Client> {
    return this.http.put<Client>(`${environment.url_ms_modulos}clients/${titular.id}`, titular);
  }

  buscarPorUserId(userId: string): Observable<Client> {
    return this.http.get<Client>(`${environment.url_ms_modulos}buscar_UserID?user_id=${userId}`);
  }
  buscarPorEmail(email: string): Observable<Client> {
    return this.http.get<Client>(`${environment.url_ms_modulos}buscar_Email?email=${email}`);
  }

  checkIfClientPaid(data: { id: number }): Observable<any> {
    // Realiza una solicitud GET a la nueva ruta con el id del cliente
    return this.http.get<any>(`${environment.url_ms_modulos}clients/${data.id}/payments/accepted`);
  }



  security(name: string, email: string, password: string): Observable<Client> {
    return this.http.post<Client>(`${environment.url_ms_security}/users/public`, { name, email, password });
  }

  delete(id: number): Observable<Client> {
    return this.http.delete<Client>(`${environment.url_ms_modulos}clients/${id}`);
  }

}
