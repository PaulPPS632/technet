import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { VentaReporteDto } from '../models/venta-reporte';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  apiUrl: string = environment.API_URL+"/inventory";

  constructor(private http: HttpClient, private cookiesService: CookieService) {}

  getVentasReporte(): Observable<VentaReporteDto[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.get<VentaReporteDto[]>(this.apiUrl + "/reportes", {headers});
  }
}
