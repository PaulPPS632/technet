import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable, tap } from 'rxjs';

interface authresponse {
  token: string;
  username: string;
  rol: string;
}
interface response {
  estado: boolean;
  username: string;
  rol: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.API_URL + '/auth';
  constructor(private http: HttpClient) {}

  register(registerRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerRequest).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('rol', response.rol);
        localStorage.setItem('User', response.username);
      }),
    );
  }

  isLoggedIn(): Observable<any> {
    const request = {
      token: localStorage.getItem('authToken'),
    };
    console.log('ingresa isloggedin');
    return this.http.post<any>(`${this.apiUrl}/validate`, request).pipe(
      map((res) => ({
        estado: res.estado,
        rol: res.rol,
        user: res.user,
      })),
    );
  }

  Logged(email: string, password: string): Observable<any> {
    const loginRequest = {
      email,
      password,
    };
    return this.http.post<any>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.token);
        //localStorage.setItem('rol', response.rol);
        localStorage.setItem('User', JSON.stringify(response.usuario));
      }),
    );
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
