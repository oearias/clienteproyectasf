import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  constructor(
    private http: HttpClient
  ) { }

  getEstados(){
    return this.http.get('assets/json/estados.json');
  }
}
