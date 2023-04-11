import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatDateService {

  constructor() { }

  formatFecha(fecha: Date) {

    console.log(fecha);

    let d = new Date(fecha),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

      console.log(day);

    return [year, month, day].join('-');
  }
  
}
