import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environments';
import { Course } from '../models/course.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }


  list(): Observable<Course[]> {
    return this.http.get<Course[]>(`${environment.url_ms_modulos}modulos`);
  }

  getVideo(id: number): Observable<any> {
    return this.http.get(`${environment.url_ms_modulos}modulos/${id}`);
  }
  view(id: number): Observable<Course> {
    return this.http.get<Course>(`${environment.url_ms_modulos}modulos/${id}`);
  }
  create(courseData: FormData): Observable<any> {
    return this.http.post(`${environment.url_ms_modulos}modulos`, courseData);
  }
  
  update(course:Course): Observable<Course> {
    return this.http.put<Course>(`${environment.url_ms_modulos}modulos/${course.id}`, course);
  }
  delete(id: number): Observable<Course> {
    return this.http.delete<Course>(`${environment.url_ms_modulos}modulos/${id}`);
  }

  getExamsByModule(moduleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.url_ms_modulos}modulos/${moduleId}/exams`);
  }

  listByCursoTipo(curso_tipo: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${environment.url_ms_modulos}modulos/tipo/${curso_tipo}`);
  }

  
}

