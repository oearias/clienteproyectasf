import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TipoAsentamiento } from 'src/app/interfaces/TipoAsentamiento';
import { TipoAsentamientoService } from '../../../services/tipo-asentamiento.service';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-asentamiento',
  templateUrl: './asentamiento.component.html',
  styleUrls: ['./asentamiento.component.css']
})
export class AsentamientoComponent implements OnInit {

  tipoAsentamientoForm = this.fb.group({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    abreviatura: new FormControl(null, Validators.required)
  });

  editingTipoAsentamiento: TipoAsentamiento;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tipoAsentamientoService: TipoAsentamientoService,
    private toastr: ToastrService,
  ) { 
    this.tipoAsentamientoForm.setValue({
      id: null,
      nombre: null,
      abreviatura: null
    });
  }

  ngOnInit(): void {

    this.setPath();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.tipoAsentamientoService.getTipoAsentamiento(params.id).subscribe(res => {

          this.editingTipoAsentamiento = res;

          this.id?.setValue(this.editingTipoAsentamiento.id);
          this.nombre?.setValue(this.editingTipoAsentamiento.nombre);
          this.abreviatura?.setValue(this.editingTipoAsentamiento.abreviatura);
        });

      }
    });
  }

  saveTipoAsentamiento() {

    if (this.tipoAsentamientoForm.valid) {

      if (this.tipoAsentamientoForm.value.id != null) {

        this.tipoAsentamientoService.updateTipoAsentamiento(this.tipoAsentamientoForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.tipoAsentamientoService.insertTipoAsentamiento(this.tipoAsentamientoForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/asentamientos');

    }
  }

  onChangeTipoAsentamiento(event) {
  }

  volver() {
    this.router.navigate(['/catalogos/asentamientos']);
  }

  setPath(){
    this.pathService.path = '/catalogos/asentamientos';
  }

  //Getters
  get id() {
    return this.tipoAsentamientoForm.get('id');
  }

  get nombre() {
    return this.tipoAsentamientoForm.get('nombre');
  }

  get abreviatura() {
    return this.tipoAsentamientoForm.get('abreviatura');
  }

}
