import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable, tap } from 'rxjs';

interface authresponse{
token: string,
username: string,
rol: string
}
interface response{
  estado:boolean,
  username:string,
  rol: string
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.API_URL+"/auth";
  constructor(private http: HttpClient) { }

  register(registerRequest: RegisterRequest): Observable<authresponse> {
    return this.http.post<authresponse>(`${this.apiUrl}/register`, registerRequest).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('rol', response.rol);
        localStorage.setItem('username', response.username);
      })
    );
  }

  isLoggedIn(): Observable<response> {
    const request = {
      token: localStorage.getItem('authToken')
    };
    console.log("ingresa isloggedin");
    return this.http.post<response>(`${this.apiUrl}/validate`, request).pipe(
      map(res => ({
        estado: res.estado,
        username: res.username,
        rol: res.rol
      }))
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
        localStorage.setItem('rol', response.rol);
        localStorage.setItem('username', response.username);
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
