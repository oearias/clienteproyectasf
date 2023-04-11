import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RoleUser } from '../interfaces/RoleUser';

@Injectable({
  providedIn: 'root'
})
export class RoleUserService {

  private URL_API = environment.apiUrl+'usuarios_roles';
  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(
    private http:HttpClient
  ) { }

  getRolesUser(){
    return this.http.get<RoleUser[]>(this.URL_API);
  }

  getRolesByCriteria(criterio, palabra){
    return this.http.get<RoleUser[]>(`${this.URL_API}/${criterio}/${palabra}`);
  }

  getRoleUser(id: number){
    return this.http.get<RoleUser>(`${this.URL_API}/${id}`)
  }

  insertRoleUser(role: RoleUser){
    return this.http.post(this.URL_API, role)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  updateRoleUser(role: RoleUser){
    return this.http.put(`${this.URL_API}/${role.id}`, role)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  deleteRoleUser(role:RoleUser){
    return this.http.delete(`${this.URL_API}/${role.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }
}
