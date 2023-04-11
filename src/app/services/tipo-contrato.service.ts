import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TipoContrato } from '../interfaces/TipoContrato';

@Injectable({
  providedIn: 'root'
})
export class TipoContratoService {

  private URL_API = environment.apiUrl+'tipos/contrato';
  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }

  getTipoContratos(){
    return this.http.get<TipoContrato[]>(this.URL_API);
  }

  getTipoContratosByCriteria(criterio, palabra){
    return this.http.get<TipoContrato[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getTipoContrato(id:number){
    return this.http.get<TipoContrato>(`${this.URL_API}/${id}`);
  }

  insertTipoContrato(tc: TipoContrato){
    return this.http.post(this.URL_API, tc)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateTipoContrato(tc:TipoContrato){
    return this.http.put(`${this.URL_API}/${tc.id}`, tc)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteTipoContrato(tc:TipoContrato){
    return this.http.delete(`${this.URL_API}/${tc.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
