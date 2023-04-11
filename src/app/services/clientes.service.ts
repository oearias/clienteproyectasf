import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Cliente } from '../interfaces/Cliente';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  
}
