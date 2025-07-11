import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Payments } from '../models/payments.model';

// Define la interfaz para la orden

@Injectable({
  providedIn: 'root'
})
export class PayService {

  http = inject(HttpClient)

  Create(payment: Payments): Observable<Payments> {
    return this.http.post(`${environment.url_ms_modulos}payments`, payment);
  }

  // Método para realizar el pago
  update(payment: Payments): Observable<Payments> {
    return this.http.put<Payments>(`${environment.url_ms_modulos}payments/${payment.id}`, payment);
  }

  list(): Observable<Payments[]> {
    return this.http.get<Payments[]>(`${environment.url_ms_modulos}payments`);
  }

  delete(id: number) {
  return this.http.delete(`${environment.url_ms_modulos}payments/${id}`);
}
}
