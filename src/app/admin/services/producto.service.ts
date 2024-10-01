import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoResponse } from '../models/producto-response';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  apiUrl: string = environment.API_URL + '/inventory/producto';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}
  headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  });
  getListaProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.headers,
    });
  }
  getListaProductosFact(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fact`, { headers: this.headers });
  }
  postNuevoProducto(productoNuevo: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, productoNuevo, {
      headers: this.headers,
    });
  }
  putProducto(productoNuevo: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, productoNuevo, {
      headers: this.headers,
    });
  }
  getProductoById(id: string): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/${id}`);
  }

  deleteProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.headers,
    });
  }

  getListadoCategoriaProducto(limit: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/CategoriaProducto?limit=${limit}`,
    );
  }
}
