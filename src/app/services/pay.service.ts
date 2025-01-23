import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Payments } from '../models/payments.model';

// Define la interfaz para la orden

@Injectable({
  providedIn: 'root'
})
export class PayService {

  constructor(private http: HttpClient) { }

  Create(payment: Payments): Observable<Payments> {
    return this.http.post(`${environment.url_ms_modulos}payments`, payment);
  }

  // Método para realizar el pago
  update(payment: Payments): Observable<Payments> {
    return this.http.put<Payments>(`${environment.url_ms_modulos}payments/${12}`, payment);
  }

  list(): Observable<Payments[]> {
    return this.http.get<Payments[]>(`${environment.url_ms_modulos}payments`);
  }
}
