import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArchivosService {
  constructor(private http: HttpClient) {}
  headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  });
  getImagenesPublicitarias(): Observable<{ [key: string]: string[] }> {
    return this.http.get<{ [key: string]: string[] }>(
      environment.API_URL + '/inventory/archivos/publicitaria',
    );
  }

  postarchivo(imagenespublicitarias: FormData): Observable<any> {
    return this.http.post<any>(
      `${environment.API_URL}` + '/inventory/archivos',
      imagenespublicitarias,
      { headers: this.headers },
    );
  }
  deleteArchivo(url: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.API_URL}` + '/inventory/archivos/',
      {
        headers: this.headers,
        body: { url: url }, // Usar 'body' para incluir la información a eliminar
      },
    );
  }
}
