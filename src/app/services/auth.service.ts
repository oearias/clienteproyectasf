import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import {map, tap} from 'rxjs/operators';
import { LoginForm } from '../interfaces/login-form';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL_API = environment.apiUrl;

  constructor(
    private http:HttpClient
  ) { }

  login(user:LoginForm){
    
    return this.http.post<any>(this.URL_API + 'auth/login', user)
      .pipe(
        tap( (resp: any) => {
          sessionStorage.setItem('token', resp.token);
        })
      )
  }
}
