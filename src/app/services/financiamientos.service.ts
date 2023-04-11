import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Financiamiento } from '../interfaces/Financiamiento';

@Injectable({
  providedIn: 'root'
})
export class FinanciamientosService {

  private URL_API = environment.apiUrl+'tipos/fuente_financiamiento';
  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }

  getFinanciamientos(){
    return this.http.get<Financiamiento[]>(this.URL_API);
  }

  getFinanciamientoByCriteria(criterio, palabra){
    return this.http.get<Financiamiento[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getFinanciamiento(id:number){
    return this.http.get<Financiamiento>(`${this.URL_API}/${id}`);

  }

  insertFinanciamiento(financiamiento: Financiamiento){
    return this.http.post(this.URL_API, financiamiento)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateFinanciamiento(financiamiento: Financiamiento){
    return this.http.put(`${this.URL_API}/${financiamiento.id}`, financiamiento)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteFinanciamiento(financiamiento: Financiamiento){
    return this.http.delete(`${this.URL_API}/${financiamiento.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
