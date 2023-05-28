import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { EstatusCredito } from '../interfaces/EstatusCredito';

@Injectable({
  providedIn: 'root'
})
export class CreditoEstatusService {

  private URL_API = environment.apiUrl+'tipos/estatus/credito';
  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(
    private http:HttpClient
  ) { }

  getEstatus(){
    return this.http.get<EstatusCredito[]>(this.URL_API);
  }
}
