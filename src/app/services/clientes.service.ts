import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Cliente } from '../interfaces/Cliente';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClienteResponse } from '../interfaces/ClienteResponse';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private URL_API = environment.apiUrl+'clientes';
  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }

  getClientes(){
    return this.http.get<Cliente[]>(this.URL_API);
  }

  getClientesPaginados(page:number, limit:number, searchTerm: string) {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm.toString());

    const url = `${this.URL_API}/clientes_list?${params.toString()}`;


    return this.http.post<ClienteResponse>(url,{});

  }

  getClientesLimitados(searchTerm: string){

    const params = new HttpParams()
      // .set('page', page.toString())
      // .set('limit', limit.toString())
      .set('searchTerm', searchTerm.toString());

    const url = `${this.URL_API}/clientes_list_limit?${params.toString()}`;

    return this.http.post<ClienteResponse>(url,{});
  }

  getClientesByCriteria(criterio, palabra){
    return this.http.get<Cliente[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getCliente(id:number){
    return this.http.get<Cliente>(`${this.URL_API}/${id}`);
  }

  insertCliente(cliente: Cliente){
    return this.http.post(this.URL_API, cliente)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateCliente(cliente:Cliente){
    return this.http.put(`${this.URL_API}/${cliente.id}`, cliente)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
  
  deleteCliente(cliente:Cliente){
    return this.http.delete(`${this.URL_API}/${cliente.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  getClientesTotal(){
    return this.http.get<number>(`${this.URL_API}/total/total`);
  }
  
}
