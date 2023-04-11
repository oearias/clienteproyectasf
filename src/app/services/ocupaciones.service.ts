import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Ocupacion } from '../interfaces/Ocupacion';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OcupacionesService {

  private URL_API = environment.apiUrl+'ocupaciones';
  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(
    private http:HttpClient
  ) { }

  getOcupaciones(){
    return this.http.get<Ocupacion>(this.URL_API);
  }

  getOcupacionesByCriteria(criterio, palabra){
    return this.http.get<Ocupacion[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getOcupacion(id: number){
    return this.http.get<Ocupacion>(`${this.URL_API}/${id}`)
  }

  insertOcupacion(ocupacion: Ocupacion){
    return this.http.post(this.URL_API, ocupacion)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateOcupacion(ocupacion: Ocupacion){
    return this.http.put(`${this.URL_API}/${ocupacion.id}`, ocupacion)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteOcupacion(ocupacion:Ocupacion){
    return this.http.delete(`${this.URL_API}/${ocupacion.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
