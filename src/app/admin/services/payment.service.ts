import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.API_URL;
  postExternalData(paymentData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/payment/external-data`, JSON.stringify(paymentData), { headers });
  }
  validatePayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment/validate`, paymentData);
  }
}
