import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoResponse } from '../models/producto-response';
import { Observable } from 'rxjs';
import { ProductoRequest } from '../models/producto-request';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  apiUrl: string = environment.API_URL+"/inventory/producto";

  constructor(private http: HttpClient, private authService: AuthService) {}
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  });
  getListaProductos(): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(this.apiUrl, {headers: this.headers});
  }

  postNuevoProducto(productoNuevo: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`,productoNuevo, {headers: this.headers});
  }
  putProducto(productoNuevo: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`,productoNuevo, {headers: this.headers});
  }
  getProductoById(id: string): Observable<ProductoRequest> {
    return this.http.get<ProductoRequest>(`${this.apiUrl}/${id}`, {headers: this.headers});
  }

  deleteProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers: this.headers});
  }
}
