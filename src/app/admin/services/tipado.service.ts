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
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  });
  getTipadoDocumentos(): Observable<TipadoDocumentos> {

    return this.http.get<TipadoDocumentos>(this.Url, {headers: this.headers});
  }

  private informacionSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  enviarInformacion(informacion: any): void {
    this.informacionSubject.next(informacion);
  }

  obtenerInformacion(): Observable<any> {
    return this.informacionSubject.asObservable();
  }
}
