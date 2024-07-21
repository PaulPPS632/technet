import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrarVentaRequest, VentaResponse } from '../models/venta-request';
import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from '../models/user-info';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RegistroVentaService {

  private readonly Url = environment.API_URL + '/inventory/registroventa';

  constructor(private http: HttpClient, private cookiesService: CookieService) { }
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
  registrar(ventaRequest: RegistrarVentaRequest): Observable<void> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    const userString = this.cookiesService.get('user');
    if (userString) {
      try {
        this.user = JSON.parse(userString);
        
      } catch (e) {
        console.error('Error parsing user cookie:', e);
      }
    }
    ventaRequest.usuario_id = this.user.id;
    console.log(ventaRequest);
    return this.http.post<void>(this.Url, ventaRequest, {headers});
  }
  Listar(): Observable<VentaResponse[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.get<VentaResponse[]>(this.Url,{headers});
  }
}
