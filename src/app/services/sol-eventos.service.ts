import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SolicitudEvento } from '../interfaces/SolicitudEvento';

@Injectable({
  providedIn: 'root'
})
export class SolEventosService {

  private URL_API = environment.apiUrl+'eventos';
  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(
    private http:HttpClient
  ) { }

  getEventosBySolicitudId(id:number){
    return this.http.get<SolicitudEvento[]>(`${this.URL_API}/${id}`);
  }
}
