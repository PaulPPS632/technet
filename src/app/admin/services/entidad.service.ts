import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entidad } from '../models/entidad-response';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class EntidadService {

  apiUrl: string = environment.API_URL+"/inventory/entidad";

  constructor(private http: HttpClient, private cookiesService: CookieService) { }

  getEntidades(): Observable<Entidad[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId')
    });
    return this.http.get<Entidad[]>(this.apiUrl, {headers});
  }

}
