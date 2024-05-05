import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Colonia } from '../interfaces/Colonia';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ColoniaResponse } from '../interfaces/ColoniaResponse';

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
  
  getColoniasPaginadas(page:number, limit:number, searchTerm: string) {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm.toString());

    const url = `${this.URL_API}/colonias_list?${params.toString()}`;


    return this.http.post<ColoniaResponse>(url,{});

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
