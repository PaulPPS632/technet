import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorrelativoService {

  private apiUrl = 'http://localhost:8080/inventory/correlativo/siguiente'; 

  constructor(private http: HttpClient, private cookiesService: CookieService) { }

  getCorrelativoSiguiente(prefijo: string, numeracion: number): Observable<number> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    let params = new HttpParams().set('prefijo', prefijo).set('numeracion', numeracion.toString());
    return this.http.get<number>(this.apiUrl, { params, headers });
  }
}
