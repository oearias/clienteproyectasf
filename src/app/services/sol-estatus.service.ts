import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EstatusSolicitud } from '../interfaces/EstatusSolicitud';

@Injectable({
  providedIn: 'root'
})
export class SolEstatusService {

  private URL_API = environment.apiUrl+'tipos/estatus/solicitud';
  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(
    private http:HttpClient
  ) { }

  getEstatus(){
    return this.http.get<EstatusSolicitud[]>(this.URL_API);
  }

  // getParentescosByCriteria(criterio, palabra){
  //   return this.http.get<EstatusSolicitud[]>(`${this.URL_API}/${criterio}/${palabra}`);
  // }

  // getParentesco(id: number){
  //   return this.http.get<Parentesco>(`${this.URL_API}/${id}`)
  // }

  // insertParentesco(parentesco: EstatusSolicitud){
  //   return this.http.post(this.URL_API, parentesco)
  //     .pipe(
  //       tap(() => {
  //         this.refresh$.next();
  //       })
  //     );
  // }

  // updateParentesco(parentesco: EstatusSolicitud){
  //   return this.http.put(`${this.URL_API}/${parentesco.id}`, parentesco)
  //   .pipe(
  //     tap(() => {
  //       this.refresh$.next();
  //     })
  //   );
  // }

  // deleteParentesco(parentesco:EstatusSolicitud){
  //   return this.http.delete(`${this.URL_API}/${parentesco.id}`)
  //   .pipe(
  //     tap(() => {
  //       this.refresh$.next();
  //     })
  //   );
  // }
}
