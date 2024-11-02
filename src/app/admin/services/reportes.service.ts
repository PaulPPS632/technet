import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  apiUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}
  headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  });
  getVentasReporte(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/inventory/reportes', {
      headers: this.headers,
    });
  }
  getproductosMasVendidos(): Observable<any> {
    return this.http.get<any>(
      this.apiUrl + '/inventory/reportes/productos-mas-vendidos',
      {
        headers: this.headers,
      },
    );
  }
}
