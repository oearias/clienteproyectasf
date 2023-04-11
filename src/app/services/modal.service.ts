import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private URL_API = environment.apiUrl;
  private _refresh$ = new Subject<void>();

  showModal = false;
  registro = "";
  path = null;
  id = null;

  constructor(
    private http: HttpClient
  ) { }

  get refresh$(){
    return this._refresh$;
  }

  deleteRegistro(){
    return this.http.delete<any>(`${this.URL_API}${this.path}/${this.id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      })
    );;
  }
}
