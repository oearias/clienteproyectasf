import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sucursal } from '../interfaces/Sucursal';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

  private URL_API = environment.apiUrl+'sucursales';
  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }

  getSucursales(){
    return this.http.get<Sucursal>(this.URL_API);
  }

  getSucursalesByCriteria(criterio, palabra){
    return this.http.get<Sucursal[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getSucursal(id:number){
    return this.http.get<Sucursal>(`${this.URL_API}/${id}`);
  }

  insertSucursal(sucursal: Sucursal){
    return this.http.post(this.URL_API, sucursal)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateSucursal(sucursal:Sucursal){
    return this.http.put(`${this.URL_API}/${sucursal.id}`, sucursal)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteSucursal(sucursal:Sucursal){
    return this.http.delete(`${this.URL_API}/${sucursal.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
