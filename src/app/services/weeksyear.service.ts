import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeeksyearService {

  constructor(
    private http: HttpClient
  ) { }

  getSemanas(){
    return this.http.get('assets/json/weeksyear.json');
  }
}
