import { Injectable } from '@angular/core';
import { UserInfo } from '../models/user-info';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  CompraResponse,
  RegistrarCompraRequest,
} from '../models/compra-request';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RegistroCompraService {
  private readonly Url = environment.API_URL + '/inventory/compra';

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
  registrar(compraRequest: RegistrarCompraRequest): Observable<any> {
    compraRequest.usuario_id = JSON.parse(localStorage.getItem('User')!).id;
    return this.http.post<any>(this.Url, compraRequest, {
      headers: this.headers,
    });
  }
  Listar(): Observable<CompraResponse[]> {
    return this.http.get<CompraResponse[]>(this.Url, { headers: this.headers });
  }
}
