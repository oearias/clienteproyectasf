import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GrupoUsuarioResponse } from '../interfaces/GrupoUsuarioResponse';
import { GrupoUsuario } from '../interfaces/GrupoUsuario';
import { tap } from 'rxjs/operators';
import { Modulo } from '../interfaces/Modulo';
import { PermisoModuloRes } from '../interfaces/PermisoModuloRes';

@Injectable({
  providedIn: 'root'
})
export class GrupoUsuarioService {

  private URL_API = environment.apiUrl + 'grupos_usuarios';
  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  get refresh$() {
    return this._refresh$;
  }

  getGruposUsuarios(page: number, limit: number, searchTerm: string) {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm.toString());

    const url = `${this.URL_API}/grupo_usuario_list?${params.toString()}`;


    return this.http.post<GrupoUsuarioResponse>(url, {});
  }

  getGruposUsuariosList() {

    const params = new HttpParams()

    const url = `${this.URL_API}/grupos_usuarios_list?${params.toString()}`;


    return this.http.post<GrupoUsuarioResponse>(url,{});
  }

  getGrupoUsuario(id:number){
    return this.http.get<GrupoUsuario>(`${this.URL_API}/${id}`);
  }

  insertGrupoUsuario(grupoUsuario: GrupoUsuario){
    return this.http.post(this.URL_API, grupoUsuario)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateGrupoUsuario(grupoUsuario: GrupoUsuario){
    return this.http.put(`${this.URL_API}/${grupoUsuario.id}`, grupoUsuario)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteGrupoUsuario(grupoUsuario: GrupoUsuario){
    return this.http.delete(`${this.URL_API}/${grupoUsuario.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  getPermisosModulosByUserGroupID(id:number){
    return this.http.get<PermisoModuloRes>(`${this.URL_API}/modulos_user_group/${id}`);
  }

  updatePermisosModulosSubmodulos(data:any){

    return this.http.post(`${this.URL_API}/update_permisos`, data)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }
  
}
