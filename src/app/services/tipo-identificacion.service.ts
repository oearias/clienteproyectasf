import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TipoIdentificacion } from '../interfaces/TipoIdentificacion';

@Injectable({
  providedIn: 'root'
})
export class TipoIdentificacionService {

  private URL_API = environment.apiUrl+'tipos/identificacion';
  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(
    private http: HttpClient
  ) { }

  getTipoIdentificaciones(){
    return this.http.get<TipoIdentificacion>(this.URL_API);
  }

  getTipoIdentificacionesByCriteria(criterio, palabra){
    return this.http.get<TipoIdentificacion[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getTipoIdentificacion(id:number){
    return this.http.get<TipoIdentificacion>(`${this.URL_API}/${id}`);
  }

  insertTipoIdentificacion(ti: TipoIdentificacion){
    return this.http.post(this.URL_API, ti)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateTipoIdentificacion(ti: TipoIdentificacion){
    return this.http.put(`${this.URL_API}/${ti.id}`, ti)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteTipoIdentificacion(ti: TipoIdentificacion){
    return this.http.delete(`${this.URL_API}/${ti.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
