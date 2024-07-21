import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubCategoriaResponse } from '../models/subcategoria-response';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {

  apiUrl: string = environment.API_URL+"/inventory/subcategoria";

  constructor(private http: HttpClient, private cookiesService: CookieService) { }

  getSubCategorias(): Observable<SubCategoriaResponse[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.get<SubCategoriaResponse[]>(this.apiUrl, {headers: headers});
  }

  deleteSubCategoria(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers: headers});
  }
}
