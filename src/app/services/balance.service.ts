import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Balance } from '../interfaces/Balance';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  private URL_API = environment.apiUrl+'balances';
  private _refresh$ = new Subject<void>();

  constructor(
    private http:HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }

  getAdeudo(id:number){
    return this.http.get<Balance>(`${this.URL_API}/${id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
