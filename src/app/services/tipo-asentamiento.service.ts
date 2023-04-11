import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TipoAsentamiento } from '../interfaces/TipoAsentamiento';

@Injectable({
  providedIn: 'root'
})
export class TipoAsentamientoService {

  private URL_API = environment.apiUrl+'tipos/asentamiento';
  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }

  getTipoAsentamientos(){
    return this.http.get<TipoAsentamiento>(this.URL_API);
  }

  getTipoAsentamientoByCriteria(criterio, palabra){
    return this.http.get<TipoAsentamiento[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getTipoAsentamiento(id:number){
    return this.http.get<TipoAsentamiento>(`${this.URL_API}/${id}`);

  }

  insertTipoAsentamiento(ta: TipoAsentamiento){
    return this.http.post(this.URL_API, ta)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateTipoAsentamiento(ta: TipoAsentamiento){
    return this.http.put(`${this.URL_API}/${ta.id}`, ta)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteTipoAsentamiento(ta: TipoAsentamiento){
    return this.http.delete(`${this.URL_API}/${ta.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
