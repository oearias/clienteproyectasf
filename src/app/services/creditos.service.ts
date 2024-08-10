import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Amortizacion } from '../interfaces/Amortizacion';
import { Credito } from '../interfaces/Credito';
import { CreditoResponse } from '../interfaces/CreditoResponse';
import { Semana } from '../interfaces/Semana';

@Injectable({
  providedIn: 'root'
})
export class CreditosService {

  private URL_API = environment.apiUrl + 'creditos';
  private _refresh$ = new Subject<void>();

  get refresh$() {
    return this._refresh$;
  }

  constructor(
    private http: HttpClient
  ) { }

  // getCreditos() {
  //   return this.http.get<Credito[]>(this.URL_API);
  // }

  getCreditos() {
    return this.http.get<any>(this.URL_API);
  }

  getCreditosPaginados(page:number, limit:number, searchTerm: string) {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm.toString());

    const url = `${this.URL_API}/creditos_list?${params.toString()}`;


    return this.http.post<CreditoResponse>(url,{});

  }

  getCreditosByClienteId(page:number, limit:number, searchTerm: string, cliente_id: number) {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm.toString());

    const body = {
      cliente_id: cliente_id
    }

    const url = `${this.URL_API}/creditos_cliente?${params.toString()}`;


    return this.http.post<CreditoResponse>(url,body);

  }

  getCreditosLimitados(searchTerm: string) {

    const params = new HttpParams()
      // .set('page', page.toString())
      // .set('limit', limit.toString())
      .set('searchTerm', searchTerm.toString());

    const url = `${this.URL_API}/creditos_list_limit?${params.toString()}`;

    return this.http.post<any>(url,{});

  }

  getCreditosLimitadosInversionPositiva(searchTerm: string) {

    const params = new HttpParams()
      // .set('page', page.toString())
      // .set('limit', limit.toString())
      .set('searchTerm', searchTerm.toString());

    const url = `${this.URL_API}/creditos_list_limit/inversion_positiva?${params.toString()}`;

    return this.http.post<any>(url,{});

  }

  getCreditosInversionPositiva(page:number, limit:number, searchTerm: string) {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm.toString());

    const url = `${this.URL_API}/creditos_list/inversion_positiva?${params.toString()}`;


    return this.http.post<CreditoResponse>(url,{});

  }

  getCreditosProgramacionEntrega(page:number, limit:number, searchTerm: string){

    console.log('prog');

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm.toString());

    const url = `${this.URL_API}/creditos_list/programacion_entrega?${params.toString()}`;


    return this.http.post<CreditoResponse>(url,{});
  }

  getCreditosTotales() {
    return this.http.get<number>(`${this.URL_API}/total/total`);
  }

  getCreditosByCriteria(criterio, palabra) {
    return this.http.get<Credito[]>(`${this.URL_API}/search/${criterio}/${palabra}`);
  }

  getCredito(id: number) {
    return this.http.get<Credito>(`${this.URL_API}/${id}`)
  }

  getCreditoOptimizado(id: number) {
    return this.http.post<Credito>(`${this.URL_API}/credito`,{
      credito_id: id
    })
  }

  insertCredito(credito: Credito) {
    return this.http.post(this.URL_API, credito)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateCredito(credito: Credito) {
    return this.http.put(`${this.URL_API}/${credito.id}`, credito)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  deleteCredito(credito: Credito) {
    return this.http.delete(`${this.URL_API}/${credito.id}`)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateFechaCreditosMasivos(arreglo: Array<any>) {
    return this.http.patch(`${this.URL_API}/items`, arreglo)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      )
  }

  printContratosMasivos(arreglo: Array<any>) {

    return this.http.patch(`${this.URL_API}/print/contratosMasivos`, arreglo, { responseType: 'arraybuffer' })
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });

  }

  getAmortizacion(credito_id: Number) {
    return this.http.get<Amortizacion[]>(`${this.URL_API}/amortizacion/${credito_id}`)
  }

  downloadContrato(credito: Credito): any {

    return this.http.post(`${this.URL_API}/print/${credito.id}`, { flag: 1 }, { responseType: 'blob' }).subscribe(res => {

      var file = new Blob([res], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });
  }

  downloadAmortizacion(credito: Credito): any {

    return this.http.post(`${this.URL_API}/print/amortizacion/${credito.id}`, { flag: 1 }, { responseType: 'blob' }).subscribe(res => {

      var file = new Blob([res], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });
  }

  downloadTarjetaPagos(credito: Credito): any {

    return this.http.post(`${this.URL_API}/print/tarjeta/${credito.id}`, { flag: 1 }, { responseType: 'blob' }).subscribe(res => {

      var file = new Blob([res], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });
  }

  downloadCreditos(fecha?: Date) {

    return this.http.patch(`${this.URL_API}/print/creditos`, { fecha_inicio: fecha }, { responseType: 'blob' }).subscribe(res => {

      var file = new Blob([res], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });
  }

  downloadAllDocumentation(credito: Credito): any {

    return this.http.post(`${this.URL_API}/print/allDoc/${credito.id}`, credito, { responseType: 'blob' }).subscribe(res => {

      var file = new Blob([res], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });
  }

  downloadEntregasCredito(fechaEntrega: any) {

    return this.http.post(`${this.URL_API}/print/reporteEntregaCredito/1`, { fecha_entrega_prog: fechaEntrega }, { responseType: 'blob' }).subscribe(res => {

      var file = new Blob([res], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });
  }

  downloadReporteCartasPDF(semana: Semana){

    return this.http.post(`${this.URL_API}/print/reporte_cartas/${semana.id}`, semana, { responseType: 'blob' }).subscribe(res => {

      var file = new Blob([res], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });

  }

  downloadReporteDebitoAgenciasPDF(semana: Semana){

    return this.http.post(`${this.URL_API}/print/reporte_debito_agencias_pdf/${semana.id}`, semana, { responseType: 'blob' }).subscribe(res => {

      var file = new Blob([res], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

    });

  }
  
  downloadReporteCartasXLS(semana: Semana): void {
    this.http.post(`${this.URL_API}/print/reporte_cartasXLS/${semana.id}`, semana, { responseType: 'blob' })
      .subscribe(
        (res: Blob) => {
          // Crear una URL para el blob recibido
          const fileURL = URL.createObjectURL(res);
  
          // Crear un enlace temporal para descargar el archivo
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = fileURL;
  
          // Establecer el nombre del archivo
          a.download = 'reporte_cartas.xlsx';
  
          // Simular el clic en el enlace para descargar el archivo
          a.click();
  
          // Limpiar el enlace y el blob
          URL.revokeObjectURL(fileURL);
          document.body.removeChild(a);
        },
        error => {
          console.error('Error al descargar el archivo:', error);
          // Manejar el error según sea necesario
        }
      );
  }

  downloadReporteDebitoAgenciasXLS(semana: Semana): void {
    this.http.post(`${this.URL_API}/print/reporte_debito_agenciasXLS/${semana.id}`, semana, { responseType: 'blob' })
      .subscribe(
        (res: Blob) => {
          // Crear una URL para el blob recibido
          const fileURL = URL.createObjectURL(res);
  
          // Crear un enlace temporal para descargar el archivo
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = fileURL;
  
          // Establecer el nombre del archivo
          a.download = 'reporte_cartas.xlsx';
  
          // Simular el clic en el enlace para descargar el archivo
          a.click();
  
          // Limpiar el enlace y el blob
          URL.revokeObjectURL(fileURL);
          document.body.removeChild(a);
        },
        error => {
          console.error('Error al descargar el archivo:', error);
          // Manejar el error según sea necesario
        }
      );
  }

  setInversionPositiva(credito: Credito) {
    return this.http.patch(`${this.URL_API}/inversion/${credito.id}`, credito)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  deleteInversionPositiva(credito: Credito) {
    return this.http.patch(`${this.URL_API}/deleteInversion/${credito.id}`, credito)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

}
