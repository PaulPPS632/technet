import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CategoriaRequest } from '../models/categoria-request';
import { CategoriaResponse } from '../models/categoria-response';
import { SubCategoriaResponse } from '../models/subcategoria-response';
import { SubCategoriaRequest } from '../models/subcategoria-request';
import { CategoriaMarcaRequest } from '../models/categoriamarca-request';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  apiUrl: string = "http://localhost:8080/inventory/categoria";
  Url: string = "http://localhost:8080/inventory/subcategoria";

  constructor(private http:HttpClient, private cookiesService: CookieService) {}

  getAll(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(this.apiUrl);
  }
  
  postCategoria(categoria: CategoriaRequest): Observable<any> {
    return this.http.post<CategoriaRequest>(`${this.apiUrl}`, this.postCategoria);
  }

  postSubCategoria(subCategoria: SubCategoriaRequest): Observable<any> {
    return this.http.post<any>(`${this.Url}`, subCategoria);
  }

  getSubs(id: number): Observable<SubCategoriaResponse[]> {
    return this.http.get<SubCategoriaResponse[]>(`${this.apiUrl}/subs/${id}`);
  }

  actualizarCategoria(id: number, categoria: CategoriaMarcaRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria);
  }
  
}