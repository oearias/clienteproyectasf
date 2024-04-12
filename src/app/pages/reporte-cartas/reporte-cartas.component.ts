import { Component, OnInit } from '@angular/core';
import { PathService } from '../../services/path.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Semana } from 'src/app/interfaces/Semana';
import { SemanasService } from 'src/app/services/semanas.service';
import { CreditosService } from 'src/app/services/creditos.service';

@Component({
  selector: 'app-reporte-cartas',
  templateUrl: './reporte-cartas.component.html',
  styleUrls: ['./reporte-cartas.component.css']
})
export class ReporteCartasComponent implements OnInit {

  semanas: Semana[] = [];
  semanaOpened: Semana;

  reporteForm = this.fb.group({
    weekyear: new FormControl(null, Validators.required),
    weekyear2: new FormControl(null, Validators.required),
  })

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private semanaService: SemanasService,
    private creditoService: CreditosService
  ) {
    this.reporteForm.setValue({
      weekyear: null,
      weekyear2: null
    })
  }

  ngOnInit(): void {
    this.setPath();

    this.loadData();
  }

  setPath() {
    this.pathService.path = '/dashboard/';
  }

  loadData() {

    this.semanaService.getSemanas().subscribe( semanas => {

      console.log(semanas);

      this.semanas = semanas
        .filter(item => item.estatus);

        this.semanaOpened = semanas.find(item => item.estatus);
    } )
  }

  printWeek(){

    this.creditoService.downloadReporteCartas(this.weekyear2.value);
  }

  printWeekXLS(){

    if(this.weekyear2.value != null){

      this.creditoService.downloadReporteCartasXLS(this.weekyear2.value);
    }

  }

  get weekyear2() {
    return this.reporteForm.get('weekyear2');
  }

}
