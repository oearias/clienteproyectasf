import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PathService } from 'src/app/services/path.service';
import { Semana } from '../../../interfaces/Semana';
import { SemanasService } from '../../../services/semanas.service';
import { FormatDateService } from '../../../services/format-date.service';

@Component({
  selector: 'app-semana',
  templateUrl: './semana.component.html',
  styleUrls: ['./semana.component.css']
})
export class SemanaComponent implements OnInit {

  semanaForm = this.fb.group({
    id: new FormControl(null),
    fecha_inicio: new FormControl(null, Validators.required),
    fecha_fin: new FormControl(null, Validators.required),
    weekyear: new FormControl(null, Validators.required),
    year: new FormControl(null, Validators.required),
    estatus: new FormControl(null, Validators.required)
  });

  editingSemana: Semana;
  currentYear = new Date().getFullYear();

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private semanaService: SemanasService,
    private fds: FormatDateService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
  ) { 
    this.semanaForm.setValue({
      id: null,
      fecha_inicio: null,
      fecha_fin: null,
      weekyear: null,
      year: this.currentYear,
      estatus: false
    });
  }

  ngOnInit(): void {
    this.setPath();


    this.route.params.subscribe((params) => {

      if (params.id) {
        this.semanaService.getSemana(params.id).subscribe(res => {

          this.editingSemana = res;

          this.id?.setValue(this.editingSemana.id);
          this.fecha_inicio?.setValue(this.datePipe.transform(this.editingSemana.fecha_inicio,'yyyy-MM-dd','-0500'));
          this.fecha_fin?.setValue(this.datePipe.transform(this.editingSemana.fecha_fin,'yyyy-MM-dd','-0500'));
          this.weekyear?.setValue(this.editingSemana.weekyear);
          this.year?.setValue(this.editingSemana.year);
          this.estatus?.setValue(this.editingSemana.estatus);
        });

      }
    });
  }

  saveSemana() {

    if (this.semanaForm.valid) {

      if (this.semanaForm.value.id != null) {

        this.semanaService.updateSemana(this.semanaForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.semanaService.insertSemana(this.semanaForm.value).subscribe((res: any) => {

          this.toastr.success(res);
          
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/semanas');

    }
  }

  onChangeFecha(fecha){
    console.log(fecha);
  }

  volver() {
    this.router.navigate(['/catalogos/semanas']);
  }

  setPath() {
    this.pathService.path = '/catalogos/semanas';
  }

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

  //Getters
  get id() {
    return this.semanaForm.get('id');
  }

  get fecha_inicio() {
    return this.semanaForm.get('fecha_inicio');
  }

  get fecha_fin() {
    return this.semanaForm.get('fecha_fin');
  }

  get weekyear() {
    return this.semanaForm.get('weekyear');
  }

  get year() {
    return this.semanaForm.get('year');
  }

  get estatus() {
    return this.semanaForm.get('estatus');
  }

}
