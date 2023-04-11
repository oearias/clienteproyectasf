import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Zona } from '../interfaces/Zona';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ZonasService {

  private URL_API = environment.apiUrl+'zonas';
  private _refresh$ = new Subject<void>();

  constructor(
    private http:HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }
  
  getZonas(){
    return this.http.get<Zona[]>(this.URL_API);
  }

  getZonasByCriteria(criterio, palabra){
    return this.http.get<Zona[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getZonasBySucursalId(id:number){
    return this.http.get<Zona>(`${this.URL_API}/sucursal/${id}`);
  }

  getZona(id: number){
    return this.http.get<Zona>(`${this.URL_API}/${id}`)
  }

  insertZona(zona: Zona){
    return this.http.post(this.URL_API, zona)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateZona(zona: Zona){
    return this.http.put(`${this.URL_API}/${zona.id}`, zona)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteZona(zona: Zona){
    return this.http.delete(`${this.URL_API}/${zona.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
