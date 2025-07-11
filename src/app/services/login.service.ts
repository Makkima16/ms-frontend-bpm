import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Security } from '../models/security.model';
import { environment } from '../../environments/environments';

interface SecondFactorRequest {
  id: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class Login2Service {

  http = inject(HttpClient)

  login(login : Security): Observable<Security>{
    return this.http.post<Security>(`${environment.url_ms_security}/api/public/security/login`, login);
  }

  secondAut(data : SecondFactorRequest): Observable<string>{
    return this.http.put<string>(`${environment.url_ms_security}/api/public/security/secondauth`, data);
  }
}
