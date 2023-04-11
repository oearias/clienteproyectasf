import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Colonia } from '../interfaces/Colonia';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColoniasService {
  
  private URL_API = environment.apiUrl+'colonias';
  private _refresh$ = new Subject<void>();

  constructor(
    private http:HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }

  getColonias(){
    return this.http.get<Colonia>(this.URL_API);
  }
  
  getColoniasByCriteria(criterio, palabra){
    return this.http.get<Colonia[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getColonia(id:number){
    return this.http.get<Colonia>(`${this.URL_API}/${id}`);
  }

  insertColonia(colonia: Colonia){
    return this.http.post(this.URL_API, colonia)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateColonia(colonia: Colonia){
    return this.http.put(`${this.URL_API}/${colonia.id}`, colonia)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteColonia(colonia: Colonia){
    return this.http.delete(`${this.URL_API}/${colonia.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
