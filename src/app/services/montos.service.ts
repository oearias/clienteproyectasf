import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Monto } from '../interfaces/Monto';

@Injectable({
  providedIn: 'root'
})
export class MontosService {

  private URL_API = environment.apiUrl+'montos';
  private _refresh$ = new Subject<void>();

  constructor(
    private http:HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }
  
  getMontos(){
    return this.http.get<Monto[]>(this.URL_API);
  }

  getMonto(id: number){
    return this.http.get<Monto>(`${this.URL_API}/${id}`)
  }

  getMontosByCriteria(criterio, palabra){
    return this.http.get<Monto[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  insertMonto(monto: Monto){
    return this.http.post(this.URL_API, monto)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateMonto(monto: Monto){
    return this.http.put(`${this.URL_API}/${monto.id}`, monto)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteMonto(monto: Monto){
    return this.http.delete(`${this.URL_API}/${monto.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
