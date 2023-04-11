import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Amortizacion } from '../interfaces/Amortizacion';
import { Credito } from '../interfaces/Credito';

@Injectable({
  providedIn: 'root'
})
export class CreditosService {

  private URL_API = environment.apiUrl+'creditos';
  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(
    private http:HttpClient
  ) { }

  getCreditos(){
    return this.http.get<Credito[]>(this.URL_API);
  }

  getCreditosByCriteria(criterio, palabra){
    return this.http.get<Credito[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getCredito(id: number){
    return this.http.get<Credito>(`${this.URL_API}/${id}`)
  }

  insertCredito(credito: Credito){
    return this.http.post(this.URL_API, credito)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateCredito(credito: Credito){
    return this.http.put(`${this.URL_API}/${credito.id}`, credito)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteCredito(credito:Credito){
    return this.http.delete(`${this.URL_API}/${credito.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  updateFechaCreditosMasivos(arreglo: Array<any>){
    return this.http.patch(`${this.URL_API}/items`, arreglo)
    .pipe(
      tap(()=>{
        this.refresh$.next();
      })
    )
  }

  getAmortizacion(credito_id: Number){
    return this.http.get<Amortizacion[]>(`${this.URL_API}/amortizacion/${credito_id}`)
  }

  downloadContrato(credito: Credito): any{
    
    return this.http.post(`${this.URL_API}/print/${credito.id}`, {flag:1},{responseType: 'blob'}).subscribe( res =>{

      var file = new Blob([res], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });
  }

  downloadAmortizacion(credito: Credito): any{
    
    return this.http.post(`${this.URL_API}/print/amortizacion/${credito.id}`, {flag:1},{responseType: 'blob'}).subscribe( res =>{

      var file = new Blob([res], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });
  }

  downloadTarjetaPagos(credito: Credito): any{
    
    return this.http.post(`${this.URL_API}/print/tarjeta/${credito.id}`, {flag:1},{responseType: 'blob'}).subscribe( res =>{

      var file = new Blob([res], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });
  }

  downloadAllDocumentation(credito: Credito): any{
    
    return this.http.post(`${this.URL_API}/print/allDoc/${credito.id}`, credito,{responseType: 'blob'}).subscribe( res =>{

      var file = new Blob([res], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });
  }

  downloadEntregasCredito(fechaEntrega:any){

    return this.http.post(`${this.URL_API}/print/reporteEntregaCredito/1`, {fecha_entrega_prog:fechaEntrega},{responseType: 'blob'}).subscribe( res =>{

      var file = new Blob([res], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });
  }

  setInversionPositiva(credito: Credito){
    return this.http.patch(`${this.URL_API}/inversion/${credito.id}`, credito)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteInversionPositiva(credito:Credito){
    return this.http.patch(`${this.URL_API}/deleteInversion/${credito.id}`, credito)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

}
