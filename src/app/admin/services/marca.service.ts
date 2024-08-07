import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MarcaResponse } from '../models/marca-response';
import { CategoriaMarcaResponse } from '../models/categoriamarca-response';
import { MarcaRequest } from '../models/marca-request';
import { CategoriaMarcaRequest } from '../models/categoriamarca-request';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  apiUrl: string = environment.API_URL+"/inventory/marca";
  Url: string = environment.API_URL+"/inventory/categoriamarca";

  constructor(private http: HttpClient, private cookiesService: CookieService) {}
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  });
  getAll(): Observable<MarcaResponse[]> {
    return this.http.get<MarcaResponse[]>(this.apiUrl);
  }

  postMarca(categoria: MarcaRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, categoria, {headers: this.headers});
  }

  postCategoriaMarca(categoriaMarca:CategoriaMarcaRequest): Observable<any> {
    return this.http.post<any>(`${this.Url}`, categoriaMarca, {headers: this.headers});
  }

  getSubs(id: number): Observable<CategoriaMarcaResponse[]> {
    return this.http.get<CategoriaMarcaResponse[]>(`${this.apiUrl}/subs/${id}`, {headers: this.headers});
  }
}
