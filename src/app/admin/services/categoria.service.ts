import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CategoriaRequest } from '../models/categoria-request';
import { CategoriaResponse } from '../models/categoria-response';
import { SubCategoriaResponse } from '../models/subcategoria-response';
import { SubCategoriaRequest } from '../models/subcategoria-request';
import { CategoriaMarcaRequest } from '../models/categoriamarca-request';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  apiUrl: string = environment.API_URL+"/inventory/categoria";
  Url: string = environment.API_URL+"/inventory/subcategoria";

  constructor(private http:HttpClient, private cookiesService: CookieService) {}
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  });
  getAll(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(this.apiUrl);
  }

  postCategoria(categoria: CategoriaRequest): Observable<any> {
    return this.http.post<CategoriaRequest>(`${this.apiUrl}`, categoria, {headers: this.headers});
  }

  postSubCategoria(subCategoria: SubCategoriaRequest): Observable<any> {
    return this.http.post<any>(`${this.Url}`, subCategoria, {headers: this.headers});
  }

  getSubs(id: number): Observable<SubCategoriaResponse[]> {
    return this.http.get<SubCategoriaResponse[]>(`${this.apiUrl}/subs/${id}`, {headers: this.headers});
  }

  actualizarCategoria(id: number, categoria: CategoriaMarcaRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria, {headers: this.headers});
  }

}
