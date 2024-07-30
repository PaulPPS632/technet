import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from '../models/user-info';
import { PedidoRequest, PedidoResponse } from '../models/pedido';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly Url = environment.API_URL+'/inventory/pedidos';

  constructor(private http: HttpClient, private cookiesService: CookieService) { }
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  });
  registrar(pedidoRequest: any): Observable<void> {
    return this.http.post<void>(this.Url, pedidoRequest, {headers: this.headers});
  }
  listar(): Observable<any> {
    return this.http.get<any>(this.Url, {headers: this.headers});
  }
}
