import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Agencia } from '../interfaces/Agencia';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AgenciasService {

  private URL_API = environment.apiUrl+'agencias';
  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(
    private http: HttpClient
  ) { }

  getAgencias(){
    return this.http.get<Agencia[]>(this.URL_API);
  }

  getAgenciasByCriteria(criterio, palabra){
    return this.http.get<Agencia[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getAgencia(id:number){
    return this.http.get<Agencia>(`${this.URL_API}/${id}`);
  }

  getAgenciasByZonaId(id:number){
    return this.http.get<Agencia>(`${this.URL_API}/zona/${id}`);
  }

  insertAgencia(agencia: Agencia){
    return this.http.post(this.URL_API, agencia)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateAgencia(agencia: Agencia){
    return this.http.put(`${this.URL_API}/${agencia.id}`, agencia)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteAgencia(agencia: Agencia){
    return this.http.delete(`${this.URL_API}/${agencia.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
  
}
