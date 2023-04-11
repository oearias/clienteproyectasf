import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TipoCredito } from '../interfaces/TipoCredito';

@Injectable({
  providedIn: 'root'
})
export class TipoCreditoService {

  private URL_API = environment.apiUrl+'tipos/credito';
  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }

  getTipoCreditos(){
    return this.http.get<TipoCredito[]>(this.URL_API);
  }

  getTipoCreditoByCriteria(criterio, palabra){
    return this.http.get<TipoCredito[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getTipoCredito(id:number){
    return this.http.get<TipoCredito>(`${this.URL_API}/${id}`);

  }

  insertTipoCredito(tc: TipoCredito){
    return this.http.post(this.URL_API, tc)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateTipoCredito(tc: TipoCredito){
    return this.http.put(`${this.URL_API}/${tc.id}`, tc)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteTipoCredito(tc: TipoCredito){
    return this.http.delete(`${this.URL_API}/${tc.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
