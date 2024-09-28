import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrarVentaRequest, VentaResponse } from '../models/venta-request';
import { UserInfo } from '../models/user-info';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RegistroVentaService {
  private readonly Url = environment.API_URL + '/inventory/venta';

  constructor(private http: HttpClient) {}
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
    password: '',
    tenantId: '',
    tenantName: '',
    regist: false,
    tiponegocio: '',
    rol: null,
  };
  headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  });
  registrar(ventaRequest: RegistrarVentaRequest): Observable<any> {
    ventaRequest.usuario_id = JSON.parse(localStorage.getItem('User')!).id;
    return this.http.post<any>(this.Url, ventaRequest, {
      headers: this.headers,
    });
  }
  Listar(): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(this.Url, { headers: this.headers });
  }
}
