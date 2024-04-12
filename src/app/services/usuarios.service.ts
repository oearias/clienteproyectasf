import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/Usuario';
import { UsuarioResponse } from '../interfaces/UsuarioResponse';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private URL_API = environment.apiUrl+'usuarios';
  private _refresh$ = new Subject<void>();

  constructor(
    private http:HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }
  
  getUsuarios(){
    return this.http.get<Usuario[]>(this.URL_API);
  }

  getUsuariosPaginados(page:number, limit:number, searchTem: string){
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTem.toString());

      const url = `${this.URL_API}/usuarios_list?${params.toString()}`;

      return this.http.post<UsuarioResponse>(url,{})
  }

  getUsuariosByCriteria(criterio, palabra){
    return this.http.get<Usuario[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getUsuario(id: number){
    return this.http.get<Usuario>(`${this.URL_API}/${id}`)
  }

  insertUsuario(usuario: Usuario){
    return this.http.post(this.URL_API, usuario)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateUsuario(usuario: Usuario){
    return this.http.put(`${this.URL_API}/${usuario.id}`, usuario)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteUsuario(usuario: Usuario){
    return this.http.delete(`${this.URL_API}/${usuario.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  changePassword(usuario: Usuario){
    console.log(usuario);
    return this.http.put(`${this.URL_API}/resetPassword/${usuario.id}`, usuario)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
