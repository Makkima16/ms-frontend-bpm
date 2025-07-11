import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Questions } from '../models/questions.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  http = inject(HttpClient)

    // Crear Registro Examen
    create(records: Questions): Observable<Questions> {
      return this.http.post<Questions>(`${environment.url_ms_modulos}questions`, records);
    }

    update(questions: Questions): Observable<Questions> {
      return this.http.put<Questions>(`${environment.url_ms_modulos}questions/${questions.id}`, questions);
    }

    delete(id: number): Observable<Questions> {
      return this.http.delete<Questions>(`${environment.url_ms_modulos}questions/${id}`);
    }
}
