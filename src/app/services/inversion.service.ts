import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Credito } from '../interfaces/Credito';

@Injectable({
  providedIn: 'root'
})
export class InversionService {

  private URL_API = environment.apiUrl+'creditos/inversion';
  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(
    private http:HttpClient
  ) { }

  updateCredito(credito: Credito){
    return this.http.patch(`${this.URL_API}/${credito.id}`, credito)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
