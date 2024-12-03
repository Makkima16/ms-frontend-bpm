import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  theUser = new BehaviorSubject<User>(new User());  // Para emitir la información del usuario
  constructor(private http: HttpClient) { 
    this.verifyActualSession();  // Verificar si hay sesión al cargar el servicio
  }

  /**
   * Realiza la petición al backend con el correo y la contraseña
   * para verificar si existe o no en la plataforma
   * @param user JSON con la información de correo y contraseña
   * @returns Respuesta HTTP que indica si el usuario tiene permiso de acceso
   */
  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_security}/api/public/security/login`, user);
  }

  /**
   * Crea un nuevo usuario
   * @param user Datos del nuevo usuario
   * @returns Observable con la respuesta del backend
   */
  create(user: User): Observable<User> {
    return this.http.post<User>(`${environment.url_ms_security}/api/users/public`, user);
  }

  ambulante(user: User): Observable<User> {
    return this.http.post<User>(`${environment.url_ms_security}/api/users/public/ambulante`, user);
  }

  admin(user: User): Observable<User> {
    return this.http.post<User>(`${environment.url_ms_security}/api/users/public/admin`, user);
  }

  /**
   * Realiza la segunda autenticación usando el token
   * @param id ID del usuario
   * @param token Token de autenticación
   * @returns Observable con la respuesta de la segunda autenticación
   */
  secondAuth(id: string, token: string): Observable<any> {
    return this.http.put<any>(`${environment.url_ms_security}/api/public/security/secondauth`, { id, token });
  }

  /**
   * Guarda la sesión en sessionStorage (almacenamos el token)
   * @param dataSesion Datos de la sesión, incluyendo el token
   */
  saveSession(dataSesion: any) {
    const data = {
      token: dataSesion.token,  // Solo almacenamos el token JWT
    };
    sessionStorage.setItem('sesion', JSON.stringify(data));  // Guardamos el token
    this.setUserFromToken(dataSesion.token);  // Decodificamos el token y actualizamos el usuario
  }

  /**
   * Establece el usuario usando el token decodificado
   * @param token JWT recibido del backend
   */
  setUserFromToken(token: string) {
    const user = this.decodeToken(token);  // Decodificamos el token para obtener la información
    this.theUser.next(user);  // Emitimos el usuario en el BehaviorSubject
  }

  /**
   * Permite decodificar el token JWT
   * @param token Token JWT
   * @returns Datos del usuario extraídos del payload del token
   */
  decodeToken(token: string): User {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }
    const payload = parts[1];  // El payload es la segunda parte
    const decoded = atob(payload);  // Decodificamos de base64
    return JSON.parse(decoded);  // Retornamos el usuario como un objeto
  }

  /**
   * Permite obtener la información del usuario
   * @returns Observable del usuario
   */
  getUser(): Observable<User> {
    return this.theUser.asObservable();  // Devuelve un observable del usuario
  }

  /**
   * Permite obtener la información del usuario activa
   * @returns Usuario actual
   */
  public get activeUserSession(): User {
    return this.theUser.value;  // Devuelve el valor actual del usuario
  }

  /**
   * Cierra la sesión del usuario
   */
  logout() {
    sessionStorage.removeItem('sesion');  // Removemos el token de sessionStorage
    this.theUser.next(new User());  // Reseteamos el usuario
  }

  /**
   * Verifica si hay una sesión activa
   * @returns true si hay sesión activa, false si no
   */
  existSession(): boolean {
    const sesionActual = this.getSessionData();  // Verificamos si existe el token
    return sesionActual !== null;
  }

  /**
   * Obtiene los datos de la sesión activa desde sessionStorage
   * @returns Datos de la sesión activa
   */
  getSessionData() {
    return sessionStorage.getItem('sesion');  // Obtenemos el token del sessionStorage
  }

  /**
   * Verifica si existe una sesión activa y establece el usuario
   */
  verifyActualSession() {
    const actualSesion = this.getSessionData();  // Verificamos si hay un token
    if (actualSesion) {
      const sessionData = JSON.parse(actualSesion);  // Parseamos el JSON del token
      this.setUserFromToken(sessionData.token);  // Decodificamos el token y actualizamos el usuario
    }
  }
}
