import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pago } from '../interfaces/Pago';
import { PagoResponse } from '../interfaces/PagoResponse';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  private URL_API = environment.apiUrl + 'pagos';
  private _refresh$ = new Subject<void>();

  get refresh$() {
    return this._refresh$;
  }

  constructor(
    private http: HttpClient
  ) { }

  getPagos() {

    return this.http.get<Pago[]>(this.URL_API);
  }

  getPagosPaginados(page: number, limit: number, searchTerm: string) {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm.toString());

    const url = `${this.URL_API}/pagos_list?${params.toString()}`;

    return this.http.post<PagoResponse>(url,{});

  }


  getCreditoByPagoId(pago_id: number) {
    
    return this.http.post<any>(`${this.URL_API}/pago_credito_view/`,{
      pago_id: pago_id
    });
    
  }


  getPagosByCreditoId(id: number) {
    return this.http.get<Pago[]>(`${this.URL_API}/credito/${id}`)
  }

  getPagosByCriteria(criterio, palabra) {
    return this.http.get<Pago[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getPago(id: number) {
    return this.http.get<Pago>(`${this.URL_API}/${id}`)
  }

  insertPago(pago: Pago) {
    return this.http.post(this.URL_API, pago)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updatePago(pago: Pago) {
    return this.http.put(`${this.URL_API}/${pago.id}`, pago)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  deletePago(pago: Pago) {
    return this.http.delete(`${this.URL_API}/${pago.id}`)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }
}
