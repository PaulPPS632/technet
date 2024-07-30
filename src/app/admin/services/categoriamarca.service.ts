import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaMarcaRequest } from '../models/categoriamarca-request';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoriamarcaService {

  apiUrl: string = environment.API_URL+"/inventory/categoriamarca";

  constructor(private http: HttpClient) { }
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  });
  getCategoriaMarcas(): Observable<CategoriaMarcaRequest[]> {
    return this.http.get<CategoriaMarcaRequest[]>(this.apiUrl, {headers: this.headers});
  }

  deleteCategoriaMarca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers: this.headers});
  }

}
