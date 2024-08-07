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
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  });
  registrar(ventaRequest: RegistrarVentaRequest): Observable<void> {
    
    var username = localStorage.getItem("username")
    if(username){
      ventaRequest.usuario_id = username;
    }
    
    return this.http.post<void>(this.Url, ventaRequest, {headers: this.headers});
  }
  Listar(): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(this.Url,{headers: this.headers});
  }
}
