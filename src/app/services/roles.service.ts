import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Role } from '../interfaces/Role';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private URL_API = environment.apiUrl+'roles';
  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(
    private http:HttpClient
  ) { }

  getRoles(){
    return this.http.get<Role[]>(this.URL_API);
  }

  getRolesByCreditoId(id:number){
    return this.http.get<Role[]>(`${this.URL_API}/credito/${id}`)
  }

  getRolesByCriteria(criterio, palabra){
    return this.http.get<Role[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getRole(id: number){
    return this.http.get<Role>(`${this.URL_API}/${id}`)
  }

  insertRole(role: Role){
    return this.http.post(this.URL_API, role)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateRole(role: Role){
    return this.http.put(`${this.URL_API}/${role.id}`, role)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteRole(role:Role){
    return this.http.delete(`${this.URL_API}/${role.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

}
