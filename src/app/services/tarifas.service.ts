import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Tarifa } from '../interfaces/Tarifa';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TarifasService {

  private URL_API = environment.apiUrl+'tarifas';
  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }

  getTarifas(){
    return this.http.get<Tarifa[]>(this.URL_API)
  }

  getTarifasByCriteria(criterio, palabra){
    return this.http.get<Tarifa[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getTarifa(id:number){
    return this.http.get<Tarifa>(`${this.URL_API}/${id}`);
  }

  insertTarifa(tarifa: Tarifa){

    return this.http.post(this.URL_API, tarifa)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateTarifa(tarifa:Tarifa){
    return this.http.put(`${this.URL_API}/${tarifa.id}`, tarifa)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteTarifa(tarifa:Tarifa){
    return this.http.delete(`${this.URL_API}/${tarifa.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
