import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';

interface authresponse{
token: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.API_URL+"/auth";
  constructor(private http: HttpClient) { }
  isLoggedIn(): boolean{
    return !!localStorage.getItem('authToken');
    //return false;
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
