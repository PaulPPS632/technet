import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoSerieResponse } from '../models/producto-serie-response';
import { Observable } from 'rxjs';
import { ProductoResponse } from '../models/producto-response';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductoSerieService {
  apiUrl: string = environment.API_URL + '/inventory/productoserie';

  constructor(
    private http: HttpClient,
    private cookiesService: CookieService,
  ) {}
  headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  });
  getListaProductoSerie(): Observable<ProductoSerieResponse[]> {
    return this.http.get<ProductoSerieResponse[]>(this.apiUrl);
  }
  getProductoSerie(serie: string): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/belong/${serie}`, {
      headers: this.headers,
    });
  }

  getSeriesByProductoId(
    id_producto: string | null | undefined,
  ): Observable<ProductoSerieResponse[]> {
    return this.http.get<ProductoSerieResponse[]>(
      `${this.apiUrl}/stock/${id_producto}`,
      { headers: this.headers },
    );
  }
}
