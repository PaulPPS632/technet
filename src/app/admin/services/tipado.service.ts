import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipadoDocumentos } from '../models/tipado-documentos';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TipadoService {

  private Url = environment.API_URL+'/inventory/tipado'; 

  constructor(private http: HttpClient, private cookiesService: CookieService) { }

  getTipadoDocumentos(): Observable<TipadoDocumentos> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.get<TipadoDocumentos>(this.Url, {headers});
  }

  private informacionSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  enviarInformacion(informacion: any): void {
    this.informacionSubject.next(informacion);
  }

  obtenerInformacion(): Observable<any> {
    return this.informacionSubject.asObservable();
  }
}
