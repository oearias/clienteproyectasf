import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TipoIdentificacion } from 'src/app/interfaces/TipoIdentificacion';
import { TipoIdentificacionService } from 'src/app/services/tipo-identificacion.service';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-identificacion',
  templateUrl: './identificacion.component.html',
  styleUrls: ['./identificacion.component.css']
})
export class IdentificacionComponent implements OnInit {

  tipoIdentificacionForm = this.fb.group({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required)
  });

  editingTipoIdentificacion: TipoIdentificacion;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tipoIdentificacionService: TipoIdentificacionService,
    private toastr: ToastrService,
  ) { 
    this.tipoIdentificacionForm.setValue({
      id: null,
      nombre: null
    });
  }

  ngOnInit(): void {

    this.setPath();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.tipoIdentificacionService.getTipoIdentificacion(params.id).subscribe(res => {

          this.editingTipoIdentificacion = res;
          this.id?.setValue(this.editingTipoIdentificacion.id);
          this.nombre?.setValue(this.editingTipoIdentificacion.nombre);
          
        });

      }
    });
  }

  saveTipoIdentificacion() {

    if (this.tipoIdentificacionForm.valid) {

      if (this.tipoIdentificacionForm.value.id != null) {

        this.tipoIdentificacionService.updateTipoIdentificacion(this.tipoIdentificacionForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.tipoIdentificacionService.insertTipoIdentificacion(this.tipoIdentificacionForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/identificaciones');

    }
  }

  volver() {
    this.router.navigate(['/catalogos/identificaciones']);
  }

  setPath(){
    this.pathService.path = '/catalogos/identificaciones';
  }

  //Getters
  get id() {
    return this.tipoIdentificacionForm.get('id');
  }

  get nombre() {
    return this.tipoIdentificacionForm.get('nombre');
  }

}
