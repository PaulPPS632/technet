import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entidad } from '../models/entidad-response';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment.development';
import { EntidadRequest } from '../models/entidad-request';

@Injectable({
  providedIn: 'root'
})

export class EntidadService {

  apiUrl: string = environment.API_URL+"/inventory/entidad";

  constructor(private http: HttpClient, private cookiesService: CookieService) { }
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  });
  getEntidades(): Observable<Entidad[]> {
    return this.http.get<Entidad[]>(this.apiUrl, {headers: this.headers});
  }

  postEntidad(entidad: EntidadRequest): Observable<any> {
    return this.http.post<EntidadRequest>(`${this.apiUrl}`, entidad, {headers: this.headers});
  }

  

}
