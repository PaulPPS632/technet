import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable, tap } from 'rxjs';

interface authresponse{
token: string
}
interface response{
  estado:boolean
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.API_URL+"/auth";
  constructor(private http: HttpClient) { }
  isLoggedIn(): Observable<boolean> {
    const request = {
      token: localStorage.getItem('authToken')
    };
    return this.http.post<response>(`${this.apiUrl}/validate`, request).pipe(
      map(res => res.estado)
    );
  }
  Logged(username: string, password:string): Observable<authresponse>{
    const loginRequest = {
      username,
      password
    };
    return this.http.post<authresponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
      })
    );
  }
  logout() {
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
