import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CorrelativoService {

  private apiUrl = environment.API_URL+'/inventory/correlativo/siguiente'; 

  constructor(private http: HttpClient, private cookiesService: CookieService) { }
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  });
  getCorrelativoSiguiente(prefijo: string, numeracion: number): Observable<number> {
    let params = new HttpParams().set('prefijo', prefijo).set('numeracion', numeracion.toString());
    return this.http.get<number>(this.apiUrl, { params, headers: this.headers });
  }
}
