import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ocupacion } from 'src/app/interfaces/Ocupacion';
import { OcupacionesService } from '../../../services/ocupaciones.service';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-ocupacion',
  templateUrl: './ocupacion.component.html',
  styleUrls: ['./ocupacion.component.css']
})
export class OcupacionComponent implements OnInit {

  ocupacionForm = this.fb.group({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
  });

  editingOcupacion: Ocupacion;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ocupacionService: OcupacionesService,
  ) { 
    this.ocupacionForm.setValue({
      id: null,
      nombre: null,
    });
  }

  ngOnInit(): void {

    this.setPath();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.ocupacionService.getOcupacion(params.id).subscribe(res => {

          this.editingOcupacion = res;

          this.id?.setValue(this.editingOcupacion.id);
          this.nombre?.setValue(this.editingOcupacion.nombre);
        });

      }
    });
  }

  saveOcupacion() {

    if (this.ocupacionForm.valid) {

      if (this.ocupacionForm.value.id != null) {

        this.ocupacionService.updateOcupacion(this.ocupacionForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.ocupacionService.insertOcupacion(this.ocupacionForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/ocupaciones');

    }
  }

  volver() {
    this.router.navigate(['/catalogos/ocupaciones']);
  }

  setPath(){
    this.pathService.path = '/catalogos/ocupaciones';
  }

  //Getters
  get id() {
    return this.ocupacionForm.get('id');
  }

  get nombre() {
    return this.ocupacionForm.get('nombre');
  }


}
