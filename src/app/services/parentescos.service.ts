import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Parentesco } from '../interfaces/Parentesco';

@Injectable({
  providedIn: 'root'
})
export class ParentescosService {

  private URL_API = environment.apiUrl+'tipos/parentesco';
  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(
    private http:HttpClient
  ) { }

  getParentescos(){
    return this.http.get<Parentesco>(this.URL_API);
  }

  getParentescosByCriteria(criterio, palabra){
    return this.http.get<Parentesco[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getParentesco(id: number){
    return this.http.get<Parentesco>(`${this.URL_API}/${id}`)
  }

  insertParentesco(parentesco: Parentesco){
    return this.http.post(this.URL_API, parentesco)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateParentesco(parentesco: Parentesco){
    return this.http.put(`${this.URL_API}/${parentesco.id}`, parentesco)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteParentesco(parentesco:Parentesco){
    return this.http.delete(`${this.URL_API}/${parentesco.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
