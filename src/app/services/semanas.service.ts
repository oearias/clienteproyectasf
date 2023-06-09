import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Semana } from '../interfaces/Semana';

@Injectable({
  providedIn: 'root'
})
export class SemanasService {

  private URL_API = environment.apiUrl+'semanas';
  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }

  getSemanas(){
    return this.http.get<Semana[]>(this.URL_API);
  }

  getSemanasByCriteria(criterio, palabra){
    return this.http.get<Semana[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getSemana(id:number){
    return this.http.get<Semana>(`${this.URL_API}/${id}`);
  }

  insertSemana(semana: Semana){
    return this.http.post(this.URL_API, semana)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateSemana(semana:Semana){
    return this.http.put(`${this.URL_API}/${semana.id}`, semana)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteSemana(semana:Semana){
    return this.http.delete(`${this.URL_API}/${semana.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  insertYear(year: any){
    return this.http.post(this.URL_API+'/createYear', year)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }
}
