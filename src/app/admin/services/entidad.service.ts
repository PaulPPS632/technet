import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entidad } from '../models/entidad-response';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment.development';
import { EntidadRequest } from '../models/entidad-request';

@Injectable({
  providedIn: 'root',
})
export class EntidadService {
  apiUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}
  headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  });
  getEntidades(): Observable<Entidad[]> {
    return this.http.get<Entidad[]>(this.apiUrl + '/inventory/entidad', {
      headers: this.headers,
    });
  }

  postEntidad(entidad: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/inventory/entidad`, entidad, {
      headers: this.headers,
    });
  }
}
