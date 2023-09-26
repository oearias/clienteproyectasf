import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Solicitud } from '../interfaces/Solicitud';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SolicitudResponse } from '../interfaces/SolicitudResponse';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private URL_API = environment.apiUrl + 'solicitudes';
  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  get refresh$() {
    return this._refresh$;
  }

  getSolicitudes() {  //TODO: Ojo aqui por que iba Solicitud nada mas y no arreglo de solicitud
    return this.http.get<Solicitud[]>(this.URL_API);
  }

  getSolicitudesPaginadas(page:number, limit:number, searchTerm: string) {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm.toString());

    const url = `${this.URL_API}/solicitudes_credito_list?${params.toString()}`;

    return this.http.post<SolicitudResponse>(url,{});
  }

  getSolicitudesTotales() {  //TODO: Ojo aqui por que iba Soliciitud nada mas y no arreglo de solicitud
    return this.http.get<any>(`${this.URL_API}/total/total`);
  }

  getSolicitudesException(id: number) {
    return this.http.get<Solicitud[]>(`${this.URL_API}/exception/${id}`);
  }

  getSolicitudesByCriteria(criterio, palabra) {
    return this.http.get<Solicitud[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getSolicitud(id: number) {
    return this.http.get<Solicitud>(`${this.URL_API}/${id}`);
  }

  getSolicitudesByClienteId(id: number) {
    return this.http.get<Solicitud>(`${this.URL_API}/cliente/${id}`);
  }

  insertSolicitud(solicitud: Solicitud) {
    return this.http.post(this.URL_API, solicitud)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateSolicitud(solicitud: Solicitud) {
    return this.http.put(`${this.URL_API}/${solicitud.id}`, solicitud)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateSolicitudEstatus(arreglo: Array<number>) {
    return this.http.patch(`${this.URL_API}/items`, arreglo)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      )
  }

  deleteSolicitud(solicitud: Solicitud) {
    return this.http.delete(`${this.URL_API}/${solicitud.id}`)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }
}
