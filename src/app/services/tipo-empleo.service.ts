import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TipoEmpleo } from '../interfaces/TipoEmpleo';

@Injectable({
  providedIn: 'root'
})
export class TipoEmpleoService {

  private URL_API = environment.apiUrl+'tipos/empleo';
  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(
    private http: HttpClient
  ) { }

  getTipoEmpleos(){
    return this.http.get<TipoEmpleo>(this.URL_API);
  }

  getTipoEmpleosByCriteria(criterio, palabra){
    return this.http.get<TipoEmpleo[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getTipoEmpleo(id:number){
    return this.http.get<TipoEmpleo>(`${this.URL_API}/${id}`);
  }

  insertTipoEmpleo(te: TipoEmpleo){
    return this.http.post(this.URL_API, te)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateTipoEmpleo(te: TipoEmpleo){
    return this.http.put(`${this.URL_API}/${te.id}`, te)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteTipoEmpleo(te: TipoEmpleo){
    return this.http.delete(`${this.URL_API}/${te.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
