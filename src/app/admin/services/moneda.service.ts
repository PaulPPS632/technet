import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonedaService {

  private apiURL = 'https://api.exchangerate-api.com/v4/latest/PEN'; // Cambia de moneda API

  constructor(private http: HttpClient) { }

  getCambio(): Observable<any> {
    return this.http.get(this.apiURL);
  }
}