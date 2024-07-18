import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { UserInfo } from '../models/user-info';
import { RolResponse } from '../models/rol-response';
import { Logica } from '../models/logica';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl: string = "http://localhost:8080/user";

  constructor(private http: HttpClient, private cookiesService: CookieService) {}
  user: UserInfo = {
    id: '',
    sub: '',
    name: '',
    given_name: '',
    family_name: '',
    picture: '',
    email: '',
    email_verified: false,
    locale: '',
    password:'',
    tenantId : '',
    tenantName:'',
    regist: false,
    tiponegocio: '',
    rol: null,
  };
  getUsuariosTenant(): Observable<UserInfo[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.get<UserInfo[]>(this.apiUrl + "/tenant/" + this.cookiesService.get('tenantId'), {headers});
  }
  getRoles(): Observable<RolResponse[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId')
    });
    return this.http.get<RolResponse[]>(this.apiUrl + "/roles", {headers})
  }
  getLogica(): Observable<Logica>{
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId')
    });
    const userString = this.cookiesService.get('user');
    if (userString) {
      try {
        this.user = JSON.parse(userString);
        
      } catch (e) {
        console.error('Error parsing user cookie:', e);
      }
    }
    return this.http.get<Logica>(this.apiUrl + "/logica/" + this.user.id, {headers})
  }
  putUsuario(usuario: UserInfo): Observable<any>{
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId')
    });
    return this.http.put(this.apiUrl + "/asignarrol", usuario, {headers})
  }
  deleteUser(usuario: UserInfo): Observable<any>{
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId')
    });
    return this.http.delete(`${this.apiUrl}/${usuario.id}`, {headers});
  }
  postNuevoProducto(productoNuevo: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.post<any>(`${this.apiUrl}`,productoNuevo, {headers: headers});
  }

  deleteProducto(id: string): Observable<void> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers: headers});
  }
}
