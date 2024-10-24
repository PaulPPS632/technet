import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {
  constructor(private http: HttpClient) {}
  private readonly Url = environment.API_URL + '/inventory/cotizacion';
  headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  });
  registrar(ventaRequest: any): Observable<any> {
    ventaRequest.usuario_id = JSON.parse(localStorage.getItem('User')!).id;
    return this.http.post<any>(this.Url, ventaRequest, {
      headers: this.headers,
    });
  }
  getPagedCotizaciones(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.Url}?page=${page}&size=${pageSize}`, {
      headers: this.headers,
    });
  }
  getCotizacionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.Url}/${id}`, { headers: this.headers });
  }
}
