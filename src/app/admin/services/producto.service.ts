import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoResponse } from '../models/producto-response';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ProductoRequest } from '../models/producto-request';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  apiUrl: string = "http://localhost:8080/inventory/producto";

  constructor(private http: HttpClient, private cookiesService: CookieService) {}

  getListaProductos(): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(this.apiUrl);
  }

  postNuevoProducto(productoNuevo: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`,productoNuevo);
  }
  putProducto(productoNuevo: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`,productoNuevo);
  }
  getProductoById(id: string): Observable<ProductoRequest> {
    return this.http.get<ProductoRequest>(`${this.apiUrl}/${id}`);
  }

  deleteProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
