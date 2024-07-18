import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MarcaResponse } from '../models/marca-response';
import { CategoriaMarcaResponse } from '../models/categoriamarca-response';
import { MarcaRequest } from '../models/marca-request';
import { CategoriaMarcaRequest } from '../models/categoriamarca-request';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  apiUrl: string = "http://localhost:8080/inventory/marca";
  Url: string = "http://localhost:8080/inventory/categoriamarca";

  constructor(private http: HttpClient, private cookiesService: CookieService) {}

  getAll(): Observable<MarcaResponse[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.get<MarcaResponse[]>(this.apiUrl, {headers: headers});
  }

  postMarca(categoria: MarcaRequest): Observable<any> {
    const headers = new HttpHeaders().set('tenantId', this.cookiesService.get('tenantId'));
    return this.http.post<any>(`${this.apiUrl}`, categoria, {headers: headers});
  }

  postCategoriaMarca(categoriaMarca:CategoriaMarcaRequest): Observable<any> {
    const headers = new HttpHeaders().set('tenantId', this.cookiesService.get('tenantId'));
    return this.http.post<any>(`${this.Url}`, categoriaMarca, {headers});
  }

  getSubs(id: number): Observable<CategoriaMarcaResponse[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.get<CategoriaMarcaResponse[]>(`${this.apiUrl}/subs/${id}`, {headers: headers});
  }
}
